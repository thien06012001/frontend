// src/components/pages/participate-event/EventTable.tsx

import { Link } from 'react-router'; // Client-side navigation component
import Button from '../../ui/Button'; // Reusable button component
import { Event } from '../../../types';
import { handleAPI } from '../../../handlers/api-handler';
import useUser from '../../../hooks/redux/useUser';
import { formatDate } from '../../../libs/utils';

/**
 * EventTable displays a responsive table of events the user has joined.
 * It supports sorting by date, linking to event details, and leaving events.
 *
 * Props:
 * - events: array of Event objects to render in the table
 * - onSortByDate: callback to toggle sort order when the header is clicked
 * - sortAsc: boolean indicating current sort direction (true = ascending)
 */
export default function EventTable({
  events,
  onSortByDate,
  sortAsc,
}: {
  events: Event[];
  onSortByDate: () => void;
  sortAsc: boolean;
}) {
  // Retrieve current user ID for leave action
  const user = useUser();
  const userId = user.id;

  /**
   * Handler to leave an event. Sends API request then reloads page to reflect changes.
   */
  const handleLeaveEvent = async (eventId: string) => {
    try {
      await handleAPI(`/events/${eventId}/leave`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      // Refresh the page to update the event list
      window.location.reload();
    } catch (error) {
      console.error(`Failed to leave event ${eventId}:`, error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] table-auto border border-gray-200 rounded-md text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            {/* Event Name column */}
            <th className="w-2/5 px-4 py-2">Name</th>

            {/* Date column with click-to-sort indicator */}
            <th
              className="w-1/5 px-4 py-2 cursor-pointer select-none whitespace-nowrap"
              onClick={onSortByDate}
            >
              Date {sortAsc ? '▲' : '▼'}
            </th>

            {/* Event type (hidden on very small screens) */}
            <th className="hidden sm:table-cell w-1/6 px-4 py-2">Type</th>

            {/* Slot info (hidden on small screens) */}
            <th className="hidden md:table-cell w-1/6 px-4 py-2">Slot</th>

            {/* Action column for leave button */}
            <th className="w-1/12 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id} className="border-t border-gray-200">
              {/* Name cell with link to event detail page */}
              <td className="px-4 py-2 truncate">
                <Link to={`/event/${event.id}`} className="hover:underline">
                  {event.name}
                </Link>
              </td>

              {/* Start date formatted for readability */}
              <td className="px-4 py-2 whitespace-nowrap">
                {formatDate(event.start_time)}
              </td>

              {/* Public/Private type label */}
              <td className="hidden sm:table-cell px-4 py-2">
                {event.is_public ? 'Public' : 'Private'}
              </td>

              {/* Participant count vs. capacity */}
              <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
                {event.participants.length}/{event.capacity}
              </td>

              {/* Leave button triggers API call */}
              <td className="px-4 py-2 text-center">
                <Button
                  variant="outline"
                  onClick={() => handleLeaveEvent(event.id)}
                >
                  Leave
                </Button>
              </td>
            </tr>
          ))}

          {/* Empty state when no events are provided */}
          {events.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
