// src/pages/ParticipateEvents.tsx

import { useEffect, useMemo, useState } from 'react';
import EventFilter from '../components/pages/participate-event/EventFilter';
import EventTable from '../components/pages/participate-event/EventTable';
import Pagination from '../components/pages/participate-event/Pagination';
import useUser from '../hooks/redux/useUser';
import { useFetch } from '../hooks/useFetch';
import { UserWithEvents } from '../types';

/**
 * ParticipateEvents component
 * Fetches and displays events the current user has joined,
 * with filtering, searching, sorting, and pagination controls.
 */
export default function ParticipateEvents() {
  // Retrieve current user's ID from Redux store
  const user = useUser();
  const userId = user.id;

  // Fetch joined events for the user
  // useFetch returns { data, isLoading } for the API call
  const { data, isLoading } = useFetch(`/users/${userId}/joined-events`, {});

  // Extract user data and ensure a default array
  const userData = data?.data as UserWithEvents;
  const participatingEvents = useMemo(
    () => userData?.participatingEvents || [],
    [userData],
  );

  // Local state for filter, search, sort order, and pagination
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const eventsPerPage = 3;

  /**
   * Parse initial page number from URL query (default: 1)
   */
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    return isNaN(page) || page < 1 ? 1 : page;
  };
  const [currentPage, setCurrentPage] = useState(getInitialPage);

  /**
   * Sync the currentPage state with the browser URL
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', currentPage.toString());
    const newUrl = `${window.location.pathname}?${params}`;
    window.history.pushState({}, '', newUrl);
  }, [currentPage]);

  /**
   * Toggle sort order between ascending and descending
   */
  const handleSortByDate = () => setSortAsc(prev => !prev);

  /**
   * Apply filtering, searching, and sorting to the joined events
   */
  const filteredEvents = useMemo(() => {
    let list = [...participatingEvents];

    // Filter by public/private/all
    if (filterType === 'Public') {
      list = list.filter(e => e.is_public);
    } else if (filterType === 'Private') {
      list = list.filter(e => !e.is_public);
    }

    // Filter by search term (case-insensitive)
    if (searchTerm.trim()) {
      list = list.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sort by start_time date
    list.sort((a, b) => {
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return list;
  }, [participatingEvents, filterType, searchTerm, sortAsc]);

  // Calculate pagination bounds
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  /**
   * Handle page changes and enforce valid range
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Render loading state
  if (isLoading) {
    return <div className="p-5">Loading...</div>;
  }

  // Render empty state if no joined events
  if (participatingEvents.length === 0) {
    return <div className="p-5">No events joined yet.</div>;
  }

  return (
    <div className="space-y-3 p-5 border border-gray-200 shadow-md rounded-md mt-5">
      {/* Page title */}
      <h1 className="font-semibold text-3xl">Participate event</h1>

      {/* Filter and search controls */}
      <EventFilter
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Table of events with sortable date column */}
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
