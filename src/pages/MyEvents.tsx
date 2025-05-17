import { useState, useMemo } from 'react';
import EventFilter from '../components/pages/my-events/EventFilter';
import EventTable from '../components/pages/my-events/EventTable';
import Pagination from '../components/pages/my-events/Pagination';
import { useFetch } from '../hooks/useFetch';
import useUser from '../hooks/redux/useUser';

function MyEvents() {
  const user = useUser();
  const userId = user.id;

  const { data } = useFetch(`/users/${userId}/events`, {
    method: 'GET',
  });

  const myEvents = useMemo(() => data?.data.ownedEvents || [], [data]);

  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  const handleSortByDate = () => setSortAsc(prev => !prev);

  // ✅ Combined filter + search + sort
  const filteredEvents = useMemo(() => {
    let events = [...myEvents];

    // Filter
    if (filterType === 'Public') {
      events = events.filter(e => e.is_public);
    } else if (filterType === 'Private') {
      events = events.filter(e => !e.is_public);
    }

    // Search
    if (searchTerm.trim()) {
      events = events.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sort
    events.sort((a, b) => {
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return events;
  }, [myEvents, filterType, searchTerm, sortAsc]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-3 p-5 border border-gray-200 shadow-md rounded-md mt-5 bg-white">
      <h1 className="text-3xl font-semibold">My Events</h1>

      <EventFilter
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <EventTable
        events={paginatedEvents}
        onSortByDate={handleSortByDate}
        sortAsc={sortAsc}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default MyEvents;
