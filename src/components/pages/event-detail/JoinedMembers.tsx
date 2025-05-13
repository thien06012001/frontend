import { useMemo, useState } from 'react';

type Attendee = {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
};

const initialAttendees: Attendee[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  name: `Attendee ${i + 1}`,
  email: `attendee${i + 1}@example.com`,
  phone: `+12345678${i.toString().padStart(2, '0')}`,
  joinedAt: new Date(2024, 0, i + 1).toLocaleDateString(),
}));

function JoinedMembers() {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredAttendees = useMemo(() => {
    return attendees.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, attendees]);

  const totalPages = Math.ceil(filteredAttendees.length / pageSize);
  const paginated = filteredAttendees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleKick = (id: number) => {
    setAttendees(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Joined Members</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-primary rounded-md p-2 w-64 outline-none"
        />
      </div>

      <table className="w-full table-auto border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Phone</th>
            <th className="px-3 py-2 text-left">Joined At</th>
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
              <td className="px-3 py-2">{attendee.joinedAt}</td>
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

export default JoinedMembers;
