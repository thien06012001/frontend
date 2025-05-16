// components/EventTable.tsx

import { Link } from 'react-router'; // Client-side navigation Link
import Button from '../../ui/Button'; // Reusable button component
import { Event } from '../../../types';
import { handleAPI } from '../../../handlers/api-handler';
import useUser from '../../../hooks/redux/useUser';

/** Manually format an ISO date string as DD/MM/YYYY */
function formatDate(isoString: string) {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function EventTable({
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] table-auto border border-gray-200 rounded-md text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="w-2/5 px-4 py-2">Name</th>
            <th
              className="w-1/5 px-4 py-2 cursor-pointer select-none whitespace-nowrap"
              onClick={onSortByDate}
            >
              Date {sortAsc ? '▲' : '▼'}
            </th>
            <th className="hidden sm:table-cell w-1/6 px-4 py-2">Type</th>
            <th className="hidden md:table-cell w-1/6 px-4 py-2">Slot</th>
            <th className="w-1/12 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id} className="border-t border-gray-200">
              <td className="px-4 py-2 truncate">
                <Link to={`/event/${event.id}`} className="hover:underline">
                  {event.name}
                </Link>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatDate(event.start_time)}
              </td>
              <td className="hidden sm:table-cell px-4 py-2">
                {event.is_public ? 'Public' : 'Private'}
              </td>
              <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
                {event.participants.length}/{event.capacity}
              </td>
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
