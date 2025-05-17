// src/components/pages/participate-event/EventFilter.tsx
// ------------------------------------------
// EventFilter Component
// - Provides UI controls to filter events by type and search by name.
// - Exposes current filter and search values via controlled props.
// - Notifies parent component of changes through callback props.
// ------------------------------------------

interface EventFilterProps {
  /** Currently selected filter type ("All", "Public", "Private") */
  filterType: string;
  /** Callback invoked when the filter type changes */
  onFilterTypeChange: (value: string) => void;
  /** Current search query for event names */
  searchTerm: string;
  /** Callback invoked when the search term changes */
  onSearchChange: (value: string) => void;
}

/**
 * EventFilter
 *
 * Renders a dropdown to select event visibility (All/Public/Private)
 * and an input box to search events by name.
 * Controlled by props, emits changes via provided callbacks.
 */
function EventFilter({
  filterType,
  onFilterTypeChange,
  searchTerm,
  onSearchChange,
}: EventFilterProps) {
  return (
    <div className="flex items-center space-x-3">
      {/*
        Dropdown: Selects which type of events to display.
        - value: controlled by `filterType` prop
        - onChange: calls `onFilterTypeChange` with new value
      */}
      <select
        value={filterType}
        onChange={e => onFilterTypeChange(e.target.value)}
        className="border border-primary outline-none rounded-md p-2"
      >
        <option value="All">All</option>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
      </select>

      {/*
        Input: Text field to filter events by their title.
        - placeholder: guides the user for search by name
        - value: controlled by `searchTerm` prop
        - onChange: calls `onSearchChange` with updated query
      */}
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
