import { useEffect, useMemo, useState } from 'react';
import EventFilter from '../components/pages/participate-event/EventFilter';
import EventTable from '../components/pages/participate-event/EventTable';
import Pagination from '../components/pages/participate-event/Pagination';
import useUser from '../hooks/redux/useUser';
import { useFetch } from '../hooks/useFetch';
import { UserWithEvents } from '../types';

function ParticipateEvents() {
  const user = useUser();
  const userId = user.id;

  const { data, isLoading } = useFetch(`/users/${userId}/joined-events`, {});
  const userData = data?.data as UserWithEvents;
  const participatingEvents = useMemo(
    () => userData?.participatingEvents || [],
    [userData],
  );

  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const eventsPerPage = 3;

  // Get initial page from URL
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    return isNaN(page) || page < 1 ? 1 : page;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // Sync page with URL when currentPage changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', currentPage.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [currentPage]);

  const handleSortByDate = () => setSortAsc(prev => !prev);

  const filteredEvents = useMemo(() => {
    let events = [...participatingEvents];

    if (filterType === 'Public') {
      events = events.filter(e => e.is_public);
    } else if (filterType === 'Private') {
      events = events.filter(e => !e.is_public);
    }

    if (searchTerm.trim()) {
      events = events.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    events.sort((a, b) => {
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return events;
  }, [participatingEvents, filterType, searchTerm, sortAsc]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (isLoading) return <div className="p-5">Loading...</div>;

  if (!participatingEvents || participatingEvents.length === 0) {
    return <div className="p-5">No events joined yet.</div>;
  }

  return (
    <div className="space-y-3 p-5 border border-gray-200 shadow-md rounded-md mt-5">
      <h1 className="font-semibold text-3xl">Participate event</h1>

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

export default ParticipateEvents;
