import { useMemo, useState } from 'react';

type Invitation = {
  id: number;
  name: string;
  email: string;
  sentAt: string;
};

const initialInvitations: Invitation[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Invitee ${i + 1}`,
  email: `invitee${i + 1}@example.com`,
  sentAt: new Date(2024, 4, i + 1).toLocaleDateString(),
}));

function Invitations() {
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);
  const [search, setSearch] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invitations.filter(
      inv =>
        inv.name.toLowerCase().includes(q) ||
        inv.email.toLowerCase().includes(q),
    );
  }, [search, invitations]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSend = () => {
    if (!nameInput.trim() || !emailInput.trim()) return;

    const newInvite: Invitation = {
      id: invitations.length + 1,
      name: nameInput.trim(),
      email: emailInput.trim(),
      sentAt: new Date().toLocaleDateString(),
    };

    setInvitations(prev => [...prev, newInvite]);
    setNameInput('');
    setEmailInput('');
    setCurrentPage(1); // reset pagination
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

      {/* Send Invitation Form */}
      <div className="flex gap-3 flex-wrap items-center">
        <input
          type="text"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          placeholder="Name"
          className="border border-primary rounded-md p-2 outline-none"
        />
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
          disabled={!nameInput.trim() || !emailInput.trim()}
        >
          Send Invitation
        </button>
      </div>

      {/* Search Input */}
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

      {/* Invitation Table */}
      <table className="w-full table-auto border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Sent At</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(inv => (
            <tr key={inv.id} className="border-t">
              <td className="px-3 py-2">{inv.id}</td>
              <td className="px-3 py-2">{inv.name}</td>
              <td className="px-3 py-2">{inv.email}</td>
              <td className="px-3 py-2">{inv.sentAt}</td>
              <td className="px-3 py-2">
                <button
                  onClick={() => handleRemove(inv.id)}
                  className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                >
                  Remove
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
