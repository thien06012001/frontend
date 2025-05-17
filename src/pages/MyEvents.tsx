// src/pages/MyEvents.tsx

import { useEffect, useMemo, useState } from 'react';
import EventFilter from '../components/pages/my-events/EventFilter';
import EventTable from '../components/pages/my-events/EventTable';
import Pagination from '../components/pages/my-events/Pagination';
import { useFetch } from '../hooks/useFetch';
import useUser from '../hooks/redux/useUser';

/**
 * MyEvents page
 * Fetches and displays events owned by the current user,
 * with filtering, searching, sorting, and pagination.
 */
function MyEvents() {
  // Retrieve current user ID from Redux store
  const user = useUser();
  const userId = user.id;

  // Fetch owned events for the user on mount
  const { data } = useFetch(`/users/${userId}/events`, { method: 'GET' });

  // Memoize owned events to avoid unnecessary recalculation
  const myEvents = useMemo(() => data?.data.ownedEvents || [], [data]);

  // Local state for filter type (All/Public/Private), search term, and sort order
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Number of events to show per page
  const eventsPerPage = 3;

  /**
   * Parse initial page number from URL query (defaults to 1)
   */
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    return isNaN(page) || page < 1 ? 1 : page;
  };
  const [currentPage, setCurrentPage] = useState<number>(getInitialPage);

  /**
   * Sync currentPage state with URL query string on change
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', currentPage.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [currentPage]);

  /**
   * Toggle sort order when header is clicked
   */
  const handleSortByDate = () => setSortAsc(prev => !prev);

  /**
   * Filter, search, and sort the events list based on user inputs
   */
  const filteredEvents = useMemo(() => {
    let events = [...myEvents];

    // Filter by public/private/all
    if (filterType === 'Public') {
      events = events.filter(e => e.is_public);
    } else if (filterType === 'Private') {
      events = events.filter(e => !e.is_public);
    }

    // Filter by search term (case-insensitive match)
    if (searchTerm.trim()) {
      events = events.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sort by start_time date
    events.sort((a, b) => {
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return events;
  }, [myEvents, filterType, searchTerm, sortAsc]);

  // Calculate total pages and slice current page's events
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  /**
   * Change page handler with bounds checking
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-3 p-5 border border-gray-200 shadow-md rounded-md mt-5 bg-white">
      {/* Page title */}
      <h1 className="text-3xl font-semibold">My Events</h1>

      {/* Filter and search inputs */}
      <EventFilter
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Table displaying paginated events */}
      <EventTable
        events={paginatedEvents}
        onSortByDate={handleSortByDate}
        sortAsc={sortAsc}
      />

      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default MyEvents;
