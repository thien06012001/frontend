// pages/Invitations.tsx

import { useState } from 'react';
import InvitationPagination from '../components/pages/invitations/InvitationPagination';
import useUser from '../hooks/redux/useUser';
import { useFetch } from '../hooks/useFetch';
import { Invitation } from '../types';
import { handleAPI } from '../handlers/api-handler';

/** Format ISO date string to DD/MM/YYYY */
function formatDate(isoString: string) {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function Invitations() {
  const user = useUser();
  const userId = user.id;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useFetch(`/invitations/user/${userId}`, {
    method: 'GET',
  });

  if (isLoading) {
    return <div className="p-5">Loading...</div>;
  }
  if (!data) {
    return <div className="p-5">No invitations found.</div>;
  }

  const invitationsData = data.data as Invitation[];
  const invitationsPerPage = 3;
  const totalPages = Math.ceil(invitationsData.length / invitationsPerPage);
  const start = (currentPage - 1) * invitationsPerPage;
  const paginatedInvitations = invitationsData.slice(
    start,
    start + invitationsPerPage,
  );

  const handleResponse = async (id: string, action: 'accept' | 'reject') => {
    await handleAPI(`/invitations/${id}/${action}`, { method: 'PUT' });
    window.location.reload();
  };

  return (
    <div className="p-5 mt-5 border border-gray-200 shadow-md rounded-md space-y-4 bg-white">
      <h1 className="text-3xl font-semibold">Event Invitations</h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-auto border border-gray-200 text-sm rounded-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="w-[35%] px-4 py-2">Event Name</th>
              <th className="hidden sm:table-cell w-[20%] px-4 py-2">
                Invited At
              </th>
              <th className="w-[20%] px-4 py-2">Event Date</th>
              <th className="w-[25%] px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvitations.map(invite => (
              <tr key={invite.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{invite.event.name}</td>
                <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap">
                  {formatDate(invite.created_at)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {formatDate(invite.event.start_time)}
                </td>
                <td className="px-4 py-2 space-x-2 flex flex-wrap">
                  {invite.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleResponse(invite.id, 'accept')}
                        className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleResponse(invite.id, 'reject')}
                        className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        invite.status === 'accepted'
                          ? 'text-green-600 bg-green-100'
                          : 'text-red-600 bg-red-100'
                      }`}
                    >
                      {invite.status.charAt(0).toUpperCase() +
                        invite.status.slice(1)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {paginatedInvitations.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No invitations on this page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <InvitationPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
