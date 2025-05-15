// components/EventTable.tsx

import { Link } from 'react-router'; // Client-side navigation Link
import Button from '../../ui/Button'; //
// Reusable button component
import { Event } from '../../../types';
import { handleAPI } from '../../../handlers/api-handler';
import useUser from '../../../hooks/redux/useUser';

function EventTable({
  events,
  onSortByDate,
  sortAsc,
}: {
  events: Event[];
  onSortByDate: () => void;
  sortAsc: boolean;
}) {
  const user = useUser();
  const userId = user.id;

  const handleLeaveEvent = async (eventId: string) => {
    await handleAPI(`/events/${eventId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    window.location.reload();
  };
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
            <td className="px-4 py-2">{event.start_time}</td>

            {/* Event visibility/type */}
            <td className="px-4 py-2">
              {event.is_public ? 'Public' : 'Private'}
            </td>

            {/* Participation slot info */}
            <td className="px-4 py-2">
              {event.participants.length}/{event.capacity}
            </td>

            {/* Action button (e.g., leave event) */}
            <td
              className="px-4 py-2"
              onClick={() => handleLeaveEvent(event.id)}
            >
              <Button variant="outline">Leave</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EventTable;
