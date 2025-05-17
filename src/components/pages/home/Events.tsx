import { useEffect, useState } from 'react';
import { handleAPI } from '../../../handlers/api-handler';
import { Event } from '../../../types';
import useUser from '../../../hooks/redux/useUser';
import { formatDate } from '../../../libs/utils';

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const user = useUser();
  const userId = user.id;

  // Get initial page from query string
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    return isNaN(page) || page < 1 ? 1 : page;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [inputPage, setInputPage] = useState(getInitialPage);
  const eventsPerPage = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await handleAPI('/events', { method: 'GET' });
      const result = await res.json();
      setEvents(result.data);
    };
    fetchEvents();
  }, []);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  useEffect(() => {
    setInputPage(currentPage);
    const params = new URLSearchParams(window.location.search);
    params.set('page', currentPage.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
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
    const success = await (async () => {
      if (action === 'cancel') {
        const res = await handleAPI(
          `/requests?userId=${userId}&eventId=${eventId}`,
          { method: 'DELETE' },
        );
        return res.ok;
      }
      if (action === 'request') {
        const res = await handleAPI(`/requests`, {
          method: 'POST',
          body: JSON.stringify({ eventId, userId }),
        });
        return res.ok;
      }
      if (action === 'leave') {
        const res = await handleAPI(`/events/${eventId}/leave`, {
          method: 'POST',
          body: JSON.stringify({ userId }),
        });
        return res.ok;
      }
      return false;
    })();

    if (success) {
      setEvents(prev =>
        prev.map(event => {
          if (event.id !== eventId) return event;

          const updatedEvent = { ...event };

          if (action === 'cancel') {
            updatedEvent.requests = updatedEvent.requests.filter(
              r => r.user_id !== userId,
            );
          } else if (action === 'request') {
            updatedEvent.requests = [
              ...updatedEvent.requests,
              { user_id: userId, status: 'pending' },
            ];
          } else if (action === 'leave') {
            updatedEvent.participants = updatedEvent.participants.filter(
              p => p.id !== userId,
            );
          }

          return updatedEvent;
        }),
      );
    }
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
                <p className="block text-lg font-medium">{event.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(event.start_time)} – {formatDate(event.end_time)}
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
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-white rounded disabled:opacity-50"
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
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default Events;
