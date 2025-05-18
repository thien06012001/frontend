// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import useUser from '../hooks/redux/useUser';
import { handleAPI } from '../handlers/api-handler';
import { Event } from '../types';
import Events from '../components/pages/home/Events';
import Pagination from '../components/pages/home/Pagination';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Fetch all events once
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

  // Sync page param in URL
  useEffect(() => {
    setInputPage(currentPage);
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(currentPage));
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  }, [currentPage]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter by name, then paginate
  const filteredEvents = events.filter(ev =>
    ev.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
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
      // ... your existing request logic unchanged ...
    } catch (error) {
      console.error(`Error performing '${action}' on event ${eventId}:`, error);
    }
  };

  return (
    <section className="p-5 flex-1 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm space-y-6 mt-5">
      <h1 className="text-2xl md:text-3xl font-semibold">Homepage</h1>

      {/* Search bar */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-primary outline-none rounded-md p-2 w-full max-w-sm"
        />
      </div>

      {/* Event list */}
      <Events
        events={paginatedEvents}
        userId={userId}
        onAction={handleRequestAction}
      />

      {/* Pagination */}
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
