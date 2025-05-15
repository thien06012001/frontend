import { useState } from 'react';
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

  const participatingEvents = userData?.participatingEvents;

  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  const handleSortByDate = () => setSortAsc(prev => !prev);
  if (isLoading) {
    return <div>loading...</div>;
  }
  // Pagination logic
  const totalPages = participatingEvents
    ? Math.ceil(participatingEvents.length / eventsPerPage)
    : 0;

  const paginatedEvents = participatingEvents
    ? participatingEvents.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage,
      )
    : [];

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
