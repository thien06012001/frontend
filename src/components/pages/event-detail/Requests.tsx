import { useMemo, useState } from 'react';

import { Request } from '../../../types';
import { handleAPI } from '../../../handlers/api-handler';

type Props = {
  requests: Request[];
};

function Requests({ requests }: Props) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredRequests = useMemo(() => {
    return requests.filter(r =>
      r.user.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, requests]);

  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginated = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleApprove = async (requestId: string) => {
    await handleAPI(`/requests/${requestId}/approve`, {
      method: 'POST',
    });

    window.location.reload();
  };

  const handleReject = async (requestId: string) => {
    await handleAPI(`/requests/${requestId}/reject`, {
      method: 'POST',
    });
    window.location.reload();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Join Requests</h2>
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
            <th className="px-3 py-2 text-left">Sent At</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(request => (
            <tr key={request.id} className="border-t">
              <td className="px-3 py-2">{request.id}</td>
              <td className="px-3 py-2">{request.user.name}</td>
              <td className="px-3 py-2">{request.user.email}</td>
              <td className="px-3 py-2">{request.user.phone}</td>
              <td className="px-3 py-2">{request.created_at}</td>
              <td className="px-3 py-2 flex items-center gap-2">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="px-2 cursor-pointer py-1 text-xs rounded bg-green-600 text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="px-2 py-1 cursor-pointer text-xs rounded bg-red-600 text-white"
                >
                  Reject
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

export default Requests;
