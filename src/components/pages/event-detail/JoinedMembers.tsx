// src/components/pages/event-detail/JoinedMembers.tsx

import { useState } from 'react';
import { useParams } from 'react-router'; // Hook to read route parameters
import { handleAPI } from '../../../handlers/api-handler'; // API helper for kicking users
import { User } from '../../../types'; // User data type

/**
 * Props for the JoinedMembers component.
 *
 * @property participants - Initial list of users who have joined the event.
 */
type Props = {
  participants: User[];
};

/**
 * JoinedMembers
 *
 * Renders a searchable, paginated table of participants with the ability
 * for an organizer to "kick" (remove) members from the event.
 */
function JoinedMembers({ participants }: Props) {
  const { id } = useParams<{ id: string }>(); // Extract event ID from the URL

  // Search term for filtering participant names
  const [search, setSearch] = useState('');

  // Current page index (1-based) for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Local copy of participants to allow removal without refetch
  const [memberList, setMemberList] = useState<User[]>(participants);

  // Number of entries to show per page
  const pageSize = 10;

  // Filter participants by name, case-insensitive match
  const filtered = memberList.filter(participant =>
    participant.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Compute total pages based on filtered results
  const totalPages = Math.ceil(filtered.length / pageSize);

  // Extract only the entries for the current page
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  /**
   * handlePageChange
   *
   * Safely update the currentPage, ensuring it stays within valid bounds.
   *
   * @param page - Desired page number
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /**
   * handleKick
   *
   * Sends a POST request to remove a participant from the event,
   * then updates local state to reflect the change.
   *
   * @param userId - ID of the user to remove
   */
  const handleKick = async (userId: string) => {
    const res = await handleAPI(`/events/${id}/kick`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    // On successful response, remove the user from the local list
    if (res.ok) {
      setMemberList(prev => prev.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="space-y-3">
      {/* Header row with title and search input */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold">Joined Members</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => {
            setSearch(e.target.value); // Update search term
            setCurrentPage(1); // Reset to first page on new search
          }}
          className="border border-primary rounded-md p-2 w-full sm:w-64 outline-none"
        />
      </div>

      {/* Table wrapper for horizontal scroll on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">#Id</th>
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
            {/* Fallback row when there are no participants */}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center px-3 py-4 text-gray-500">
                  No participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-primary-foreground cursor-pointer rounded disabled:opacity-50"
        >
          Prev
        </button>

        {/* Direct page input field */}
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
