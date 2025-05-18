// src/components/pages/event-detail/Requests.tsx

import { useEffect, useMemo, useState } from 'react';
import { Request } from '../../../types'; // Type definition for join requests
import { handleAPI } from '../../../handlers/api-handler'; // API helper for POST actions
import { useFetch } from '../../../hooks/useFetch'; // Custom hook to fetch initial data
import { useParams } from 'react-router'; // Hook to retrieve URL parameters

/**
 * formatDate
 *
 * Converts an ISO timestamp into "DD/MM/YYYY" format for display.
 *
 * @param isoString - ISO-formatted date string
 * @returns formatted date as "DD/MM/YYYY"
 */
function formatDate(isoString: string) {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Requests Component
 *
 * Displays and manages the list of join requests for a specific event.
 * Features:
 * - Fetches requests on mount via `useFetch`.
 * - Allows filtering by requester name.
 * - Paginates results with configurable page size.
 * - Supports approving or rejecting requests via API calls.
 */
export default function Requests() {
  const { id } = useParams(); // Event ID from route
  const { data: requestData } = useFetch(`/events/${id}/requests`, {
    // Initial fetch of requests
    method: 'GET',
  });

  // Local state for requests list and UI controls
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState(''); // Search term for name filter
  const [currentPage, setCurrentPage] = useState(1); // Active page index
  const [inputPage, setInputPage] = useState(1); // Controlled page input value
  const pageSize = 10; // Number of items per page

  // Populate `requests` state when fetch data arrives
  useEffect(() => {
    if (requestData) {
      setRequests(requestData.data);
    }
  }, [requestData]);

  /**
   * filteredRequests
   *
   * Memoized list of requests filtered by name (case-insensitive).
   */
  const filteredRequests = useMemo(
    () =>
      requests.filter(r =>
        r.user.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, requests],
  );

  // Compute pagination parameters
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginated = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  /**
   * handlePageChange
   *
   * Updates current page and synchronizes input value, with bounds checking.
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setInputPage(page);
  };

  /**
   * removeRequest
   *
   * Removes a processed request from local state to update UI immediately.
   *
   * @param requestId - ID of the request to remove
   */
  const removeRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  /**
   * handleApprove
   *
   * Sends API call to approve a request, then removes it from the list.
   *
   * @param requestId - ID of the request to approve
   */
  const handleApprove = async (requestId: string) => {
    const res = await handleAPI(`/requests/${requestId}/approve`, {
      method: 'POST',
    });
    if (res.ok) removeRequest(requestId);
  };

  /**
   * handleReject
   *
   * Sends API call to reject a request, then removes it from the list.
   *
   * @param requestId - ID of the request to reject
   */
  const handleReject = async (requestId: string) => {
    const res = await handleAPI(`/requests/${requestId}/reject`, {
      method: 'POST',
    });
    if (res.ok) removeRequest(requestId);
  };

  return (
    <div className="space-y-3">
      {/* Header with title and search input */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold">Join Requests</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => {
            setSearch(e.target.value); // Update search term
            setCurrentPage(1); // Reset to first page on new search
            setInputPage(1);
          }}
          className="border border-primary rounded-md p-2 w-full sm:w-64 outline-none"
        />
      </div>

      {/* Table of requests */}
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
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
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
