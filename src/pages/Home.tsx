import { useEffect, useState } from 'react';
import useUser from '../hooks/redux/useUser';
import { handleAPI } from '../handlers/api-handler';
import { Event, Request } from '../types';
import Events from '../components/pages/home/Events';
import Pagination from '../components/pages/home/Pagination';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const user = useUser();
  const userId = user.id;

  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [inputPage, setInputPage] = useState(getInitialPage);
  const eventsPerPage = 3;

  useEffect(() => {
    (async () => {
      try {
        const res = await handleAPI('/events', { method: 'GET' });
        if (!res.ok) return;
        const { data } = (await res.json()) as { data: Event[] };
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    })();
  }, []);

  useEffect(() => {
    setInputPage(currentPage);
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(currentPage));
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  }, [currentPage]);

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  const changePage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    setCurrentPage(p);
  };

  const handleRequestAction = async (
    eventId: string,
    action: 'request' | 'cancel' | 'leave',
  ) => {
    try {
      if (action === 'request') {
        const res = await handleAPI('/requests', {
          method: 'POST',
          body: JSON.stringify({ eventId, userId }),
        });
        if (!res.ok) return;

        // Construct new request manually to avoid undefined fields
        const newRequest: Partial<Request> = {
          user_id: userId,
          event_id: eventId,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // @ts-expect-error it's fine
        setEvents(prev =>
          prev.map(ev =>
            ev.id !== eventId
              ? ev
              : {
                  ...ev,
                  requests: [...(ev.requests ?? []), newRequest],
                },
          ),
        );
      } else if (action === 'cancel') {
        const res = await handleAPI(
          `/requests?userId=${userId}&eventId=${eventId}`,
          { method: 'DELETE' },
        );
        if (!res.ok) return;

        setEvents(prev =>
          prev.map(ev =>
            ev.id !== eventId
              ? ev
              : {
                  ...ev,
                  requests: ev.requests.filter(
                    r => !(r.user_id === userId && r.event_id === eventId),
                  ),
                },
          ),
        );
      } else {
        const res = await handleAPI(`/events/${eventId}/leave`, {
          method: 'POST',
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) return;

        setEvents(prev =>
          prev.map(ev =>
            ev.id !== eventId
              ? ev
              : {
                  ...ev,
                  participants: ev.participants.filter(p => p.id !== userId),
                },
          ),
        );
      }
    } catch (error) {
      console.error(`Error performing '${action}' on event ${eventId}:`, error);
    }
  };

  return (
    <section className="p-5 flex-1 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm space-y-6 mt-5">
      <h1 className="text-2xl md:text-3xl font-semibold">Homepage</h1>

      <Events
        events={paginatedEvents}
        userId={userId}
        onAction={handleRequestAction}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        inputPage={inputPage}
        onInputChange={setInputPage}
        onPageChange={changePage}
      />
    </section>
  );
}
