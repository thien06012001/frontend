import { useMemo, useState } from 'react';

type InvitationStatus = 'Pending' | 'Accepted' | 'Declined';

type Invitation = {
  id: number;
  email: string;
  sentAt: string;
  status: InvitationStatus;
};

const statuses: InvitationStatus[] = ['Pending', 'Accepted', 'Declined'];

const initialInvitations: Invitation[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  email: `invitee${i + 1}@example.com`,
  sentAt: new Date(2024, 4, i + 1).toLocaleDateString(),
  status: statuses[Math.floor(Math.random() * statuses.length)],
}));

function Invitations() {
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);
  const [search, setSearch] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invitations.filter(inv => inv.email.toLowerCase().includes(q));
  }, [search, invitations]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSend = () => {
    if (!emailInput.trim()) return;

    const newInvite: Invitation = {
      id: Date.now(),
      email: emailInput.trim(),
      sentAt: new Date().toLocaleDateString(),
      status: 'Pending',
    };

    setInvitations(prev => [newInvite, ...prev]);
    setEmailInput('');
    setCurrentPage(1);
  };

  const handleRemove = (id: number) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Invitations</h2>
      <p className="text-sm text-gray-600">
        Total invitations sent: {invitations.length}
      </p>

      {/* Send Invitation */}
      <div className="flex gap-3 flex-wrap items-center">
        <input
          type="email"
          value={emailInput}
          onChange={e => setEmailInput(e.target.value)}
          placeholder="Email"
          className="border border-primary rounded-md p-2 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!emailInput.trim()}
        >
          Send Invitation
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search invitations..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="border border-primary rounded-md p-2 w-64 outline-none"
      />

      {/* Table */}
      <table className="w-full table-auto border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Sent At</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((inv, index) => (
            <tr key={inv.id} className="border-t">
              <td className="px-3 py-2">
                {(currentPage - 1) * pageSize + index + 1}
              </td>
              <td className="px-3 py-2">{inv.email}</td>
              <td className="px-3 py-2">{inv.sentAt}</td>
              <td className="px-3 py-2">{inv.status}</td>
              <td className="px-3 py-2">
                <button
                  onClick={() => handleRemove(inv.id)}
                  className={`px-2 py-1 text-xs rounded ${
                    inv.status === 'Pending'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {inv.status === 'Pending' ? 'Remove' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => handlePageChange(idx + 1)}
            className={`px-3 py-1 border border-primary rounded ${
              currentPage === idx + 1
                ? 'bg-primary text-white'
                : 'hover:bg-primary hover:text-white'
            }`}
          >
            {idx + 1}
          </button>
        ))}
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

export default Invitations;
