// src/components/pages/my-events/EventTable.tsx

import { Link } from 'react-router';
import { Event } from '../../../types';
import { formatDate } from '../../../libs/utils';

/**
 * EventTable component for displaying a list of the user's owned events.
 * Supports sorting by date and links to individual event detail pages.
 *
 * Props:
 * - events: Array of Event objects to render in the table body
 * - onSortByDate: Callback to toggle the date sort order when header is clicked
 * - sortAsc: Boolean indicating current sort direction (true = ascending)
 */
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
    <table className="min-w-full table-fixed border border-gray-200 text-sm rounded-md">
      {/* Table header with sortable Date column */}
      <thead className="bg-gray-100 text-left">
        <tr>
          {/* Event Name column */}
          <th className="w-[40%] px-4 py-2">Event Name</th>

          {/* Date column: click to toggle sort */}
          <th
            className="w-[20%] px-4 py-2 cursor-pointer select-none"
            onClick={onSortByDate}
          >
            Date {sortAsc ? '▲' : '▼'}
          </th>

          {/* Type column showing Public/Private */}
          <th className="w-[20%] px-4 py-2">Type</th>
        </tr>
      </thead>

      <tbody>
        {/* Empty state when no events available */}
        {events.length === 0 && (
          <tr>
            <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
              No events on this page.
            </td>
          </tr>
        )}

        {/* Data rows for each event */}
        {events.map(event => (
          <tr key={event.id} className="border-t border-gray-200">
            {/* Event name with link to details */}
            <td className="px-4 py-2 truncate">
              <Link to={`/event/${event.id}`} className="hover:underline">
                {event.name}
              </Link>
            </td>

            {/* Formatted start date */}
            <td className="px-4 py-2 whitespace-nowrap">
              {formatDate(event.start_time)}
            </td>

            {/* Public vs. Private label */}
            <td className="px-4 py-2">
              {event.is_public ? 'Public' : 'Private'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EventTable;
