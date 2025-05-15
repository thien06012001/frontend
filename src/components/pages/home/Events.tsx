// components/Events.tsx

import { useEffect, useState } from 'react';
// import { useToast } from '../../../hooks/context/ToastContext'; // Context hook for global toast notifications
import { Link } from 'react-router'; // Link component for client-side navigation
import { handleAPI } from '../../../handlers/api-handler';
import { Event } from '../../../types';
import useUser from '../../../hooks/redux/useUser';

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const user = useUser();
  const userId = user.id;

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await handleAPI('/events', {
        method: 'GET',
      });

      const result = await res.json();

      const data = result.data;

      setEvents(data);
    };

    fetchEvents();
  }, []);

  // --- Pagination state ---
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // --- Toast notifications from context ---
  // const { showToast } = useToast();

  // Compute the events to render on the current page
  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  const handleRequestAction = async (eventId: string, action: string) => {
    if (action === 'cancel') {
      await handleAPI(`/requests?userId=${userId}&eventId=${eventId}`, {
        method: 'DELETE',
      });
    }

    if (action === 'request') {
      await handleAPI(`/requests`, {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          userId,
        }),
      });
    }

    if (action === 'leave') {
      await handleAPI(`/events/${eventId}/leave`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    }

    window.location.reload();
  };

  /**
   * Changes the current page number, respecting bounds [1, totalPages].
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="relative p-5 flex-1 flex flex-col justify-around mt-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Page heading */}
      <h1 className="font-semibold text-3xl mb-5">Homepage</h1>

      {/* Event cards */}
      <div className="flex flex-col space-y-3">
        {paginatedEvents.map(event => {
          let buttonLabel = 'Request';
          let buttonColor = 'bg-blue-500 hover:bg-blue-600';

          const isRequestPending = event.requests.some(
            request =>
              request.user_id === userId && request.status === 'pending',
          );

          const isJoined = event.participants.some(
            participant => participant.id === userId,
          );

          if (isRequestPending) {
            buttonLabel = 'Cancel';
            buttonColor = 'bg-red-500 hover:bg-red-600';
          } else if (isJoined) {
            buttonLabel = 'Leave';
            buttonColor = 'bg-green-500 hover:bg-green-600';
          }
          const isOwner = event.owner_id === userId;

          return (
            <div
              key={event.id}
              className="flex-1 flex justify-between items-center border border-gray-200 rounded-md p-3"
            >
              {/* Event details */}
              <div className="space-y-1 flex-1">
                <Link to={`/event/${event.id}`} className="font-medium text-lg">
                  {event.name}
                </Link>
                <p className="text-xs text-gray-400">
                  {event.start_time} – {event.end_time}
                </p>
                <div className="flex items-center space-x-3 mt-3">
                  {/* Location */}
                  <div className="flex text-xs items-center space-x-1">
                    <img src="/icons/global.png" alt="Location icon" />
                    <span>{event.location}</span>
                  </div>
                  {/* Attendee count */}
                  <div className="flex text-xs items-center space-x-1">
                    <img
                      src="/icons/people.png"
                      alt="Attendees icon"
                      className="size-4"
                    />
                    <span>{event.participants.length}</span>
                  </div>
                </div>
              </div>

              {!isOwner && (
                <button
                  onClick={() =>
                    handleRequestAction(
                      event.id,
                      isJoined
                        ? 'leave'
                        : isRequestPending
                          ? 'cancel'
                          : 'request',
                    )
                  }
                  className={`text-white ${buttonColor} text-sm py-2 px-4 rounded-md transition-all cursor-pointer  disabled:bg-gray-300`}
                >
                  {buttonLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-2 pt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded border border-primary hover:bg-primary hover:text-white ${currentPage === page ? 'bg-primary text-white' : ''}`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default Events;
