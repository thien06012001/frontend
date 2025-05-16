import { useState } from 'react';
import { User } from '../../../types';
import { useParams } from 'react-router';
import { handleAPI } from '../../../handlers/api-handler';

type Props = {
  participants: User[];
};

function JoinedMembers({ participants }: Props) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(participants.length / pageSize);
  const paginated = participants
    .filter(participant =>
      participant.name.toLowerCase().includes(search.toLowerCase()),
    )
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const { id } = useParams();

  const handleKick = async (userId: string) => {
    await handleAPI(`/events/${id}/kick`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    window.location.reload();
  };

  return (
    <div className="space-y-3">
      {/* Header with search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold">Joined Members</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-primary rounded-md p-2 w-full sm:w-64 outline-none"
        />
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(attendee => (
              <tr key={attendee.id} className="border-t">
                <td className="px-3 py-2">{attendee.id}</td>
                <td className="px-3 py-2">{attendee.name}</td>
                <td className="px-3 py-2">{attendee.email}</td>
                <td className="px-3 py-2">{attendee.phone}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleKick(attendee.id)}
                    className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                  >
                    Kick
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-primary-foreground cursor-pointer rounded disabled:opacity-50"
        >
          Prev
        </button>

        <div className="flex items-center space-x-1">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={e => {
              const newPage = Number(e.target.value);
              if (newPage >= 1 && newPage <= totalPages) {
                handlePageChange(newPage);
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const newPage = Number((e.target as HTMLInputElement).value);
                if (newPage >= 1 && newPage <= totalPages) {
                  handlePageChange(newPage);
                }
              }
            }}
            className="w-12 text-center border border-gray-300 rounded-md py-1"
          />
          <span className="text-sm text-gray-600">/ {totalPages}</span>
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-primary-foreground rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default JoinedMembers;
