import { useState, useMemo } from 'react';
import EventFilter from '../components/pages/participate-event/EventFilter';
import EventTable from '../components/pages/participate-event/EventTable';
import Pagination from '../components/pages/participate-event/Pagination';

const allEvents = [
  {
    id: '1',
    name: 'Sharjah Light Festival 🖼️',
    date: 'Jan 12, 2024',
    type: 'Public',
    slot: '80/120',
  },
  {
    id: '2',
    name: 'Ramadan Iftar Tent 🌙',
    date: 'April 2, 2024',
    type: 'Public',
    slot: '80/120',
  },
  {
    id: '3',
    name: 'Mawlid al-Nabi 🕌',
    date: 'April 5, 2024',
    type: 'Private',
    slot: '80/120',
  },
  {
    id: '4',
    name: 'Eid al-Fitr 2024 🕌',
    date: 'April 10, 2024',
    type: 'Private',
    slot: '80/120',
  },
  {
    id: '5',
    name: 'Diwali Festival 🪔',
    date: 'April 16, 2024',
    type: 'Private',
    slot: '80/120',
  },
  {
    id: '6',
    name: 'Tomorrowland Belgium 💡',
    date: 'April 23, 2024',
    type: 'Private',
    slot: '80/120',
  },
  // Add more events here if needed
];

function ParticipateEvents() {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  const handleSortByDate = () => setSortAsc(prev => !prev);

  const filteredEvents = useMemo(() => {
    const result = allEvents
      .filter(event => filterType === 'All' || event.type === filterType)
      .filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
      });

    setCurrentPage(1); // Reset page when filter/search/sort changes
    return result;
  }, [filterType, searchTerm, sortAsc]);

  // Pagination logic
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

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ParticipateEvents;
