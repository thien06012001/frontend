// src/components/pages/invitations/Invitations.tsx

import { useEffect, useMemo, useState } from 'react';
import { Invitation } from '../../../types'; // Invitation data model
import { handleAPI } from '../../../handlers/api-handler'; // API helper for HTTP requests
import { useParams } from 'react-router'; // Hook to read URL parameters
import { useFetch } from '../../../hooks/useFetch'; // Custom hook for data fetching

/**
 * formatDate
 *
 * Converts an ISO date string into "DD/MM/YYYY" format.
 *
 * @param isoString - The ISO-formatted date string
 * @returns Formatted date string in "DD/MM/YYYY"
 */
function formatDate(isoString: string) {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Invitations Component
 *
 * Manages and displays a paginated, searchable list of invitations for an event.
 * - Fetches initial invitations via `useFetch`.
 * - Allows sending new invitations by email.
 * - Supports removal of existing invitations.
 */
export default function Invitations() {
  const { id } = useParams<{ id: string }>(); // Event ID from URL
  const { data: invitationsData } = useFetch(`/events/${id}/invitations`, {
    method: 'GET',
  });

  // State: full list of invitations
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  // Populate invitations once fetch completes
  useEffect(() => {
    if (invitationsData) {
      setInvitations(invitationsData.data);
    }
  }, [invitationsData]);

  // State: filter by email substring
  const [search, setSearch] = useState('');
  // State: email input for sending new invitations
  const [emailInput, setEmailInput] = useState('');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const pageSize = 10; // Items per page

  /**
   * filtered
   *
   * Memoized array of invitations whose email contains the `search` term.
   */
  const filtered = useMemo(
    () =>
      invitations.filter(inv =>
        inv.user.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, invitations],
  );

  // Compute pagination metrics
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  /**
   * handleSend
   *
   * Sends a new invitation to the specified email.
   * - Validates non-empty input.
   * - Alerts on error or adds new invitation to state on success.
   */
  const handleSend = async () => {
    const email = emailInput.trim();
    if (!email) return;

    try {
      const res = await handleAPI(`/events/${id}/invitations`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        // Extract backend error message if available
        type ErrorResponse = { error?: string; message?: string };
        const data: ErrorResponse = await res.json().catch(() => ({}));
        const msg = data.error || data.message || 'Failed to send invitation';
        alert(msg);
        return;
      }

      // On success, prepend the new invitation to state
      const newInvitation = await res.json();
      setInvitations(prev => [
        {
          id: newInvitation.id,
          user: { email },
          status: 'pending',
          created_at: new Date().toISOString(),
        } as Invitation,
        ...prev,
      ]);
      // Reset input and pagination
      setEmailInput('');
      setCurrentPage(1);
      setInputPage(1);
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  /**
   * handleRemove
   *
   * Deletes an invitation by ID.
   * - Removes from UI on success.
   * - Alerts with backend message on failure.
   *
   * @param invId - Invitation ID to remove
   */
  const handleRemove = async (invId: string) => {
    const res = await handleAPI(`/invitations/${invId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setInvitations(prev => prev.filter(inv => inv.id !== invId));
    } else {
      type ErrorResponse = { error?: string; message?: string };
      const data: ErrorResponse = await res.json().catch(() => ({}));
      const msg = data.error || data.message || 'Failed to remove invitation';
      alert(msg);
    }
  };

  /**
   * handlePageChange
   *
   * Updates the current page, ensuring it's within valid bounds.
   *
   * @param page - Target page number
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setInputPage(page);
  };

  return (
    <div className="space-y-6 sm:px-0">
      {/* Title and total count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Invitations</h2>
        <p className="text-sm text-gray-600">
          Total invitations sent: {invitations.length}
        </p>
      </div>

      {/* Search and send controls */}
      <div className="flex flex-wrap-reverse gap-4 justify-between">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search invitations..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
            setInputPage(1);
          }}
          className="w-full sm:w-64 border border-primary rounded-md p-2 outline-none"
        />

        {/* Email send controls */}
        <div className="flex flex-col xs:flex-row gap-3">
          <input
            type="email"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            placeholder="Enter email"
            className="flex-1 border border-primary rounded-md p-2 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!emailInput.trim()}
            className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Send Invitation
          </button>
        </div>
      </div>

      {/* Invitations table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Sent At</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((inv, idx) => (
              <tr key={inv.id} className="border-t">
                <td className="px-3 py-2">
                  {(currentPage - 1) * pageSize + idx + 1}
                </td>
                <td className="px-3 py-2">{inv.user.email}</td>
                <td className="px-3 py-2">{formatDate(inv.created_at)}</td>
                <td className="px-3 py-2 capitalize">{inv.status}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleRemove(inv.id)}
                    className={`px-2 py-1 text-xs rounded ${
                      inv.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {inv.status === 'pending' ? 'Remove' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No invitations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
        >
          Prev
        </button>

        {/* Page input / total indicator */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputPage}
            onChange={e => setInputPage(Number(e.target.value))}
            onKeyDown={e => {
              if (e.key === 'Enter') handlePageChange(inputPage);
            }}
            onBlur={() => handlePageChange(inputPage)}
            className="w-12 text-center border border-gray-300 rounded-md py-1"
          />
          <span className="text-sm text-gray-600">/ {totalPages}</span>
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
