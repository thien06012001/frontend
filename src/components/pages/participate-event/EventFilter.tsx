import React from 'react';

interface EventFilterProps {
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function EventFilter({
  filterType,
  onFilterTypeChange,
  searchTerm,
  onSearchChange,
}: EventFilterProps) {
  return (
    <div className="flex items-center  space-x-3">
      <select
        value={filterType}
        onChange={e => onFilterTypeChange(e.target.value)}
        className="border border-primary outline-none rounded-md p-2"
      >
        <option value="All">All</option>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
      </select>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="border border-primary outline-none rounded-md p-2 w-full max-w-sm"
      />
    </div>
  );
}

export default EventFilter;
