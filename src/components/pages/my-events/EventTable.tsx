import { Link } from 'react-router';

import { Event } from '../../../types';
import { formatDate } from '../../../libs/utils';

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
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="w-[40%] px-4 py-2">Event Name</th>
          <th
            className="w-[20%] px-4 py-2 cursor-pointer select-none"
            onClick={onSortByDate}
          >
            Date {sortAsc ? '▲' : '▼'}
          </th>
          <th className="w-[20%] px-4 py-2">Type</th>
        </tr>
      </thead>
      <tbody>
        {events.length === 0 && (
          <tr>
            <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
              No events on this page.
            </td>
          </tr>
        )}
        {events.map(event => (
          <tr key={event.id} className="border-t border-gray-200">
            <td className="px-4 py-2 truncate">
              <Link to={`/event/${event.id}`}>{event.name}</Link>
            </td>
            <td className="px-4 py-2">{formatDate(event.start_time)}</td>
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
