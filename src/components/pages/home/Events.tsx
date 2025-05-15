// components/Events.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { handleAPI } from '../../../handlers/api-handler';
import { Event } from '../../../types';
import useUser from '../../../hooks/redux/useUser';

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const user = useUser();
  const userId = user.id;

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await handleAPI('/events', { method: 'GET' });
      const result = await res.json();
      setEvents(result.data);
    };
    fetchEvents();
  }, []);

  // --- Pagination state & helpers ---
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const eventsPerPage = 3;
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // keep inputPage in sync if currentPage changes externally
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const changePage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    setCurrentPage(p);
  };

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
        body: JSON.stringify({ eventId, userId }),
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

  return (
    <section className="p-5 flex-1 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm space-y-6 mt-5">
      <h1 className="text-2xl md:text-3xl font-semibold">Homepage</h1>

      {/* Event cards */}
      <div className="space-y-4">
        {paginatedEvents.map(event => {
          const isPending = event.requests.some(
            r => r.user_id === userId && r.status === 'pending',
          );
          const isJoined = event.participants.some(p => p.id === userId);
          const isOwner = event.owner_id === userId;

          let label = 'Request';
          let color = 'bg-blue-500 hover:bg-blue-600';
          if (isPending) {
            label = 'Cancel';
            color = 'bg-red-500 hover:bg-red-600';
          } else if (isJoined) {
            label = 'Leave';
            color = 'bg-green-500 hover:bg-green-600';
          }

          return (
            <div
              key={event.id}
              className="flex flex-col md:flex-row md:justify-between md:items-center border border-gray-200 rounded-md p-4 space-y-4 md:space-y-0"
            >
              <div className="flex-1 space-y-2">
                <Link
                  to={`/event/${event.id}`}
                  className="block text-lg font-medium"
                >
                  {event.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {event.start_time} – {event.end_time}
                </p>
                <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4">
                  <span className="flex items-center space-x-1">
                    <img
                      src="/icons/global.png"
                      alt="Location"
                      className="w-4 h-4"
                    />
                    <span>{event.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <img
                      src="/icons/people.png"
                      alt="Attendees"
                      className="w-4 h-4"
                    />
                    <span>{event.participants.length}</span>
                  </span>
                </div>
              </div>

              {!isOwner && (
                <button
                  onClick={() =>
                    handleRequestAction(
                      event.id,
                      isJoined ? 'leave' : isPending ? 'cancel' : 'request',
                    )
                  }
                  className={`w-full md:w-auto text-white ${color} py-2 px-4 rounded-md text-sm transition`}
                >
                  {label}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination: Prev [input]/total Next */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-primary-foreground cursor-pointer rounded disabled:opacity-50"
        >
          Prev
        </button>

        <div className="flex items-center space-x-1">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputPage}
            onChange={e => setInputPage(Number(e.target.value))}
            onKeyDown={e => {
              if (e.key === 'Enter') changePage(inputPage);
            }}
            onBlur={() => changePage(inputPage)}
            className="w-12 text-center border border-gray-300 rounded-md py-1"
          />
          <span className="text-sm text-gray-600">/ {totalPages}</span>
        </div>

        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-primary-foreground rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default Events;
