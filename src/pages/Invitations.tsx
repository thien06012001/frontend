import { useState, useMemo } from 'react';
import InvitationPagination from '../components/pages/invitations/InvitationPagination';
import useUser from '../hooks/redux/useUser';
import { useFetch } from '../hooks/useFetch';
import { Invitation } from '../types';
import { handleAPI } from '../handlers/api-handler';

function Invitations() {
  const user = useUser();
  const userId = user.id;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useFetch(`/invitations/user/${userId}`, {
    method: 'GET',
  });
  console.log('Fetched invitations:', data);
  if (!data && isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No invitations found.</div>;
  }

  console.log('Fetched invitations:', data);
  const invitationsPerPage = 3;
  const invitationsData = data?.data as Invitation[];

  const totalPages = Math.ceil(invitationsData?.length / invitationsPerPage);
  const start = (currentPage - 1) * invitationsPerPage;
  const paginatedInvitations = invitationsData.slice(
    start,
    start + invitationsPerPage,
  );

  const handleResponse = async (id: string, action: 'accept' | 'reject') => {
    await handleAPI(`/invitations/${id}/${action}`, {
      method: 'PUT',
    });

    window.location.reload();
  };

  return (
    <div className="p-5 mt-5 border border-gray-200 shadow-md rounded-md space-y-4 bg-white">
      <h1 className="text-3xl font-semibold">Event Invitations</h1>

      <table className="min-w-full table-fixed border border-gray-200 text-sm rounded-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="w-[35%] px-4 py-2">Event Name</th>
            <th className="w-[20%] px-4 py-2">Invited At</th>
            <th className="w-[20%] px-4 py-2">Event Date</th>
            <th className="w-[25%] px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvitations.map(invite => (
            <tr key={invite.id} className="border-t border-gray-200">
              <td className="px-4 py-2">{invite.event.name}</td>
              <td className="px-4 py-2">{invite.created_at}</td>
              <td className="px-4 py-2">{invite.event.start_time}</td>
              <td className="px-4 py-2 space-x-2">
                {invite.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleResponse(invite.id, 'accept')}
                      className="px-3 py-1 cursor-pointer rounded bg-green-500 hover:bg-green-600 text-white text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleResponse(invite.id, 'reject')}
                      className="px-3 py-1 cursor-pointer rounded bg-red-500 hover:bg-red-600 text-white text-sm"
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
        </tbody>
      </table>

      <InvitationPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Invitations;
