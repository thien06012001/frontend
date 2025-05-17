import { useEffect, useMemo, useState } from 'react';
import { Request } from '../../../types';
import { handleAPI } from '../../../handlers/api-handler';
import { useFetch } from '../../../hooks/useFetch';
import { useParams } from 'react-router';

function formatDate(isoString: string) {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function Requests() {
  const { id } = useParams();

  const { data: requestData } = useFetch(`/events/${id}/requests`, {
    method: 'GET',
  });

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const pageSize = 10;
  const [requests, setRequests] = useState<Request[]>(requestData?.data || []);

  useEffect(() => {
    if (requestData) {
      setRequests(requestData.data);
    }
  }, [requestData]);

  const filteredRequests = useMemo(
    () =>
      requests.filter(r =>
        r.user.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, requests],
  );

  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginated = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setInputPage(page);
  };

  const handleApprove = async (requestId: string) => {
    await handleAPI(`/requests/${requestId}/approve`, { method: 'POST' });
    window.location.reload();
  };

  const handleReject = async (requestId: string) => {
    await handleAPI(`/requests/${requestId}/reject`, { method: 'POST' });
    window.location.reload();
  };

  return (
    <div className="space-y-3">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold">Join Requests</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
            setInputPage(1);
          }}
          className="border border-primary rounded-md p-2 w-full sm:w-64 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-auto border border-gray-200 text-sm">
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
                <td className="px-3 py-2">{formatDate(request.created_at)}</td>
                <td className="px-3 py-2 space-x-2 flex items-center">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="px-2 py-1 text-xs rounded bg-green-600 text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
        >
          Prev
        </button>

        <div className="flex items-center space-x-1">
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
          className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
