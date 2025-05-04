interface MyEventFilterProps {
  filterType: string;
  onFilterTypeChange: (val: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

function EventFilter({
  filterType,
  onFilterTypeChange,
  searchTerm,
  onSearchChange,
}: MyEventFilterProps) {
  return (
    <div className="flex items-center gap-3">
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
        placeholder="Search event name"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="border border-primary outline-none rounded-md p-2 w-full max-w-sm"
      />
    </div>
  );
}

export default EventFilter;
