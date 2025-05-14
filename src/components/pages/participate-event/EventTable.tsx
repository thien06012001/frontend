// components/EventTable.tsx
// ------------------------------------------
// EventTable Component
// - Renders a fixed-layout table of events with sortable date column.
// - Displays event name, date, type, current vs. capacity slots, and an action button.
// - Name links navigate to the event’s detail page.
// - Date column header toggles ascending/descending sort when clicked.
// ------------------------------------------

import { Link } from 'react-router'; // Client-side navigation Link
import Button from '../../ui/Button'; // Reusable button component

// Define the shape of each event row
interface Event {
  id: string;
  name: string;
  date: string;
  type: string;
  slot: {
    participated: number; // Number of users currently enrolled
    capacity: number; // Maximum allowed participants
  };
}

// Component props:
// - events: array of Event objects to display
// - onSortByDate: callback fired when user clicks the "Date" header
// - sortAsc: boolean flag indicating current sort direction
function EventTable({
  events,
  onSortByDate,
  sortAsc,
}: {
  events: Event[];
  onSortByDate: () => void;
  sortAsc: boolean;
}) {
  return (
    <table className="min-w-full table-fixed border border-gray-200 rounded-md text-sm">
      {/* Table header with sortable Date column */}
      <thead className="bg-gray-100 text-left">
        <tr>
          {/* Event Name */}
          <th className="w-[40%] px-4 py-2">Name</th>

          {/* Date: clickable to toggle sort */}
          <th
            className="w-[20%] px-4 py-2 cursor-pointer select-none"
            onClick={onSortByDate}
          >
            Date {sortAsc ? '▲' : '▼'}
          </th>

          {/* Event Type */}
          <th className="w-[15%] px-4 py-2">Type</th>

          {/* Slot usage: participated/capacity */}
          <th className="w-[15%] px-4 py-2">Slot</th>

          {/* Actions column (e.g., Leave button) */}
          <th className="w-[10%] px-4 py-2" aria-label="Actions"></th>
        </tr>
      </thead>

      {/* Table body rendering each event row */}
      <tbody>
        {events.map(event => (
          <tr key={event.id} className="border-t border-gray-200">
            {/* Event name as a link to detail view */}
            <td className="px-4 py-2 truncate">
              <Link to={`/event/${event.id}`} className="hover:underline">
                {event.name}
              </Link>
            </td>

            {/* Event date */}
            <td className="px-4 py-2">{event.date}</td>

            {/* Event visibility/type */}
            <td className="px-4 py-2">{event.type}</td>

            {/* Participation slot info */}
            <td className="px-4 py-2">
              {event.slot.participated}/{event.slot.capacity}
            </td>

            {/* Action button (e.g., leave event) */}
            <td className="px-4 py-2">
              <Button variant="outline">Leave</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EventTable;
