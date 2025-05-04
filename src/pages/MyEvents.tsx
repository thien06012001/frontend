import { useState, useMemo } from 'react';
import EventFilter from '../components/pages/my-events/EventFilter';
import EventTable from '../components/pages/my-events/EventTable';
import Pagination from '../components/pages/my-events/Pagination';

const myEvents = [
  {
    id: '1',
    name: 'Sharjah Light Festival 🖼️',
    date: 'Jan 12, 2024',
    type: 'Public',
    slot: { participated: 80, capacity: 120 },
  },
  {
    id: '2',
    name: 'Eid al-Fitr 2024 🕌',
    date: 'April 10, 2024',
    type: 'Private',
    slot: { participated: 100, capacity: 150 },
  },
  {
    id: '3',
    name: 'Tomorrowland Belgium 💡',
    date: 'April 23, 2024',
    type: 'Private',
    slot: { participated: 70, capacity: 120 },
  },
  {
    id: '4',
    name: 'Lantern Festival 2024 🏮',
    date: 'Feb 24, 2024',
    type: 'Public',
    slot: { participated: 110, capacity: 200 },
  },
];

function MyEvents() {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  const handleSortByDate = () => setSortAsc(prev => !prev);

  const filteredEvents = useMemo(() => {
    const result = myEvents
      .filter(event => filterType === 'All' || event.type === filterType)
      .filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
      });

    setCurrentPage(1);
    return result;
  }, [filterType, searchTerm, sortAsc]);

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
