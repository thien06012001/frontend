import { useEffect, useMemo, useState } from 'react';
import { Invitation } from '../../../types';
import { handleAPI } from '../../../handlers/api-handler';
import { useParams } from 'react-router';
import { useFetch } from '../../../hooks/useFetch';

function formatDate(isoString: string) {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function Invitations() {
  const { id } = useParams<{ id: string }>();
  const { data: invitationsData } = useFetch(`/events/${id}/invitations`, {
    method: 'GET',
  });

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  useEffect(() => {
    if (invitationsData) {
      setInvitations(invitationsData.data);
    }
  }, [invitationsData]);

  const [search, setSearch] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(
    () =>
      invitations.filter(inv =>
        inv.user.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, invitations],
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSend = async () => {
    if (!emailInput.trim()) return;

    try {
      const res = await handleAPI(`/events/${id}/invitations`, {
        method: 'POST',
        body: JSON.stringify({ email: emailInput.trim() }),
      });

      if (!res.ok) {
        // try to extract backend error
        type ErrorResponse = { error?: string; message?: string };
        const data: ErrorResponse = await res.json().catch(() => ({}));
        const msg =
          (data.error as string) ||
          (data.message as string) ||
          'Failed to send invitation';
        alert(msg);
        return;
      }

      // success path
      const newInvitation = await res.json();
      setInvitations(prev => [
        {
          user: { email: emailInput.trim() },
          ...newInvitation,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setEmailInput('');
      setCurrentPage(1);
      setInputPage(1);
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleRemove = async (invId: string) => {
    const res = await handleAPI(`/invitations/${invId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setInvitations(prev => prev.filter(inv => inv.id !== invId));
    } else {
      type ErrorResponse = { error?: string; message?: string };
      const data: ErrorResponse = await res
        .json()
        .catch(() => ({}) as ErrorResponse);
      const msg =
        (data.error as string) ||
        (data.message as string) ||
        'Failed to remove invitation';
      alert(msg);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setInputPage(page);
  };

  return (
    <div className="space-y-6 sm:px-0">
      {/* Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Invitations</h2>
        <p className="text-sm text-gray-600">
          Total invitations sent: {invitations.length}
        </p>
      </div>

      {/* Search & Send */}
      <div className="flex flex-wrap-reverse gap-4 justify-between">
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

      {/* Table */}
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
              <tr key={idx} className="border-t">
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

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
        >
          Prev
        </button>

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
