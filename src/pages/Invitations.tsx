import { useState, useMemo } from 'react';
import InvitationPagination from '../components/pages/invitations/InvitationPagination';

interface Invitation {
  id: string;
  eventName: string;
  eventDate: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'denied';
}

const mockInvitations: Invitation[] = [
  {
    id: '1',
    eventName: 'Sharjah Light Festival 🖼️',
    eventDate: 'Jan 12, 2024',
    invitedAt: 'Dec 30, 2023',
    status: 'pending',
  },
  {
    id: '2',
    eventName: 'Eid al-Fitr 2024 🕌',
    eventDate: 'April 10, 2024',
    invitedAt: 'Mar 28, 2024',
    status: 'pending',
  },
  {
    id: '3',
    eventName: 'Lantern Festival 2024 🏮',
    eventDate: 'Feb 24, 2024',
    invitedAt: 'Feb 10, 2024',
    status: 'pending',
  },
  {
    id: '4',
    eventName: 'Coachella Music Fest 🎶',
    eventDate: 'June 2, 2024',
    invitedAt: 'May 1, 2024',
    status: 'pending',
  },
  {
    id: '5',
    eventName: 'Comic-Con San Diego 🎭',
    eventDate: 'July 20, 2024',
    invitedAt: 'July 1, 2024',
    status: 'pending',
  },
];

function Invitations() {
  const [invitations, setInvitations] = useState(mockInvitations);
  const [currentPage, setCurrentPage] = useState(1);
  const invitationsPerPage = 3;

  const totalPages = Math.ceil(invitations.length / invitationsPerPage);

  const paginatedInvitations = useMemo(() => {
    const start = (currentPage - 1) * invitationsPerPage;
    return invitations.slice(start, start + invitationsPerPage);
  }, [currentPage, invitations]);

  const handleResponse = (id: string, action: 'accepted' | 'denied') => {
    setInvitations(prev =>
      prev.map(invite =>
        invite.id === id ? { ...invite, status: action } : invite,
      ),
    );
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
              <td className="px-4 py-2">{invite.eventName}</td>
              <td className="px-4 py-2">{invite.invitedAt}</td>
              <td className="px-4 py-2">{invite.eventDate}</td>
              <td className="px-4 py-2 space-x-2">
                {invite.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleResponse(invite.id, 'accepted')}
                      className="px-3 py-1 cursor-pointer rounded bg-green-500 hover:bg-green-600 text-white text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleResponse(invite.id, 'denied')}
                      className="px-3 py-1 cursor-pointer rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                    >
                      Deny
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
