import { useEffect, useState } from 'react';
import InvitationPagination from '../components/pages/invitations/InvitationPagination';
import useUser from '../hooks/redux/useUser';
import { useFetch } from '../hooks/useFetch';
import { Invitation } from '../types';
import { handleAPI } from '../handlers/api-handler';
import InvitationTable from '../components/pages/invitations/InvitationTable';

export default function Invitations() {
  // Get the current authenticated user and their ID
  const user = useUser();
  const userId = user.id;

  // Track the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Store the full list of invitations fetched from the server
  const [invitationsData, setInvitationsData] = useState<Invitation[]>([]);

  // Fetch invitations for this user
  const { data, isLoading } = useFetch(`/invitations/user/${userId}`, {
    method: 'GET',
  });

  // When the fetch completes, populate our local state
  useEffect(() => {
    if (data) {
      setInvitationsData(data.data);
    }
  }, [data]);

  // While loading, show a placeholder
  if (isLoading) {
    return <div className="p-5">Loading...</div>;
  }

  // If we’ve finished loading but got no data, show a message
  if (!data) {
    return <div className="p-5">No invitations found.</div>;
  }

  // --- Pagination logic ---
  const invitationsPerPage = 3;
  // Calculate how many pages we need
  const totalPages = Math.ceil(invitationsData.length / invitationsPerPage);
  // Calculate the slice start index for the current page
  const start = (currentPage - 1) * invitationsPerPage;
  // Extract only the invitations for the current page
  const paginatedInvitations = invitationsData.slice(
    start,
    start + invitationsPerPage,
  );

  // Handle user action to accept or reject an invitation
  const handleResponse = async (id: string, action: 'accept' | 'reject') => {
    // Send the PUT request to update invitation status
    const res = await handleAPI(`/invitations/${id}/${action}`, {
      method: 'PUT',
    });

    // If successful, update local state to reflect the new status
    if (res.ok) {
      setInvitationsData(prev =>
        prev.map(invite =>
          invite.id === id
            ? {
                ...invite,
                status: action === 'accept' ? 'accepted' : 'rejected',
              }
            : invite,
        ),
      );
    }
  };

  // --- Render ---
  return (
    <div className="p-5 mt-5 border border-gray-200 shadow-md rounded-md space-y-4 bg-white">
      {/* Page title */}
      <h1 className="text-3xl font-semibold">Event Invitations</h1>

      {/* Invitation list table */}
      <InvitationTable
        invitations={paginatedInvitations}
        onResponse={handleResponse}
      />

      {/* Pagination controls */}
      <InvitationPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
