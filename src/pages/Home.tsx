// src/pages/Home.tsx

/**
 * Home Component
 *
 * - Retrieves and displays a paginated list of events.
 * - Provides a search input to filter events by name.
 * - Persists the current page number in the URL.
 */

import { useEffect, useState } from 'react';
import useUser from '../hooks/redux/useUser'; // Hook to access current user
import { handleAPI } from '../handlers/api-handler'; // API helper for HTTP requests
import { Event } from '../types'; // Event data type
import Events from '../components/pages/home/Events'; // Component for rendering events
import Pagination from '../components/pages/home/Pagination'; // Component for pagination controls

export default function Home() {
  // State: all fetched events
  const [events, setEvents] = useState<Event[]>([]);
  // State: filter term for event names
  const [searchTerm, setSearchTerm] = useState('');
  // Get current user ID from Redux store
  const user = useUser();
  const userId = user.id;

  /**
   * Read the initial "page" query parameter from the URL.
   * Defaults to page 1 if the parameter is missing or invalid.
   */
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  };

  // State: current page number and controlled input value for page navigation
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [inputPage, setInputPage] = useState(getInitialPage);
  // Number of events per page
  const eventsPerPage = 3;

  // Fetch the full list of events when the component mounts
  useEffect(() => {
    (async () => {
      try {
        const res = await handleAPI(`/events?role=${user.role}`, {
          method: 'GET',
        });
        if (!res.ok) return;
        const { data } = (await res.json()) as { data: Event[] };
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    })();
  }, [user.role]);

  // Update the URL query string whenever the current page changes
  useEffect(() => {
    setInputPage(currentPage);
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(currentPage));
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  }, [currentPage]);

  // Reset to the first page whenever the search term is updated
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter events by name (case-insensitive)
  const filteredEvents = events.filter(ev =>
    ev.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate total number of pages for the filtered results
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Extract only those events for the current page
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  /**
   * Change to a new page if within valid bounds and different from current.
   */
  const changePage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    setCurrentPage(p);
  };

  /**
   * Placeholder for handling join/cancel/leave event actions.
   */
  const handleRequestAction = async (
    eventId: string,
    action: 'request' | 'cancel' | 'leave',
  ) => {
    try {
      // TODO: implement API call for action and update local state
    } catch (error) {
      console.error(`Error performing '${action}' on event ${eventId}:`, error);
    }
  };

  return (
    <section className="p-5 flex-1 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm space-y-6 mt-5">
      {/* Page title */}
      <h1 className="text-2xl md:text-3xl font-semibold">Homepage</h1>

      {/* Search input */}
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

      {/* Pagination controls */}
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
