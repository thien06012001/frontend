// src/components/pages/my-events/EventFilter.tsx

/**
 * Props for filtering events on the My Events page
 * @property filterType - Current filter selection ('All' | 'Public' | 'Private')
 * @property onFilterTypeChange - Callback to update filterType state
 * @property searchTerm - Current search input value
 * @property onSearchChange - Callback to update searchTerm state
 */
interface MyEventFilterProps {
  filterType: string;
  onFilterTypeChange: (val: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

/**
 * EventFilter component
 * Renders a dropdown for event type filtering and
 * a text input for searching event names.
 */
export default function EventFilter({
  filterType,
  onFilterTypeChange,
  searchTerm,
  onSearchChange,
}: MyEventFilterProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Dropdown to select between All, Public, or Private events */}
      <select
        value={filterType}
        onChange={e => onFilterTypeChange(e.target.value)}
        className="border border-primary outline-none rounded-md p-2"
      >
        <option value="All">All</option>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
      </select>

      {/* Text input for searching by event name */}
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
