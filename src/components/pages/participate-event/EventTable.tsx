import { Link } from 'react-router';
import Button from '../../ui/Button';

interface Event {
  id: string;
  name: string;
  date: string;
  type: string;
  slot: {
    participated: number;
    capacity: number;
  };
}

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
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="w-[40%] px-4 py-2">Name</th>
          <th
            className="w-[20%] px-4 py-2 cursor-pointer select-none"
            onClick={onSortByDate}
          >
            Date {sortAsc ? '▲' : '▼'}
          </th>
          <th className="w-[15%] px-4 py-2">Type</th>
          <th className="w-[15%] px-4 py-2">Slot</th>
          <th className="w-[10%] px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {events.map(event => (
          <tr key={event.id} className="border-t border-gray-200">
            <td className="px-4 py-2 truncate">
              <Link to={`/event/${event.id}`}>{event.name}</Link>
            </td>
            <td className="px-4 py-2">{event.date}</td>
            <td className="px-4 py-2">{event.type}</td>
            <td className="px-4 py-2">
              {event.slot.participated}/{event.slot.capacity}
            </td>
            <td className="px-4 py-2">
              <Button>Leave</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EventTable;
