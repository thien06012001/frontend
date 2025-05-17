// src/components/pages/invitations/InvitationTable.tsx

import { Invitation } from '../../../types'; // Import the Invitation type definition
import { formatDate } from '../../../libs/utils'; // Utility for formatting dates

// Props accepted by the InvitationTable component
interface InvitationTableProps {
  invitations: Invitation[]; // Array of invitations to display
  onResponse: (id: string, action: 'accept' | 'reject') => void; // Handler for accept/reject actions
}

export default function InvitationTable({
  invitations,
  onResponse,
}: InvitationTableProps) {
  return (
    // Container enables horizontal scrolling on small screens
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] table-auto border border-gray-200 text-sm rounded-md">
        {/* Table header */}
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="w-[35%] px-4 py-2">Event Name</th>
            {/* Hidden on very small screens */}
            <th className="hidden sm:table-cell w-[20%] px-4 py-2">
              Invited At
            </th>
            <th className="w-[20%] px-4 py-2">Event Date</th>
            <th className="w-[25%] px-4 py-2">Actions</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {/* Map over invitations and render each as a row */}
          {invitations.map(invite => (
            <tr key={invite.id} className="border-t border-gray-200">
              {/* Event name cell */}
              <td className="px-4 py-2">{invite.event.name}</td>

              {/* Invitation date, hidden on small screens */}
              <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap">
                {formatDate(invite.created_at)}
              </td>

              {/* Event start date */}
              <td className="px-4 py-2 whitespace-nowrap">
                {formatDate(invite.event.start_time)}
              </td>

              {/* Actions cell: accept/reject buttons or status badge */}
              <td className="px-4 py-2 space-x-2 flex flex-wrap">
                {invite.status === 'pending' ? (
                  <>
                    {/* Accept button */}
                    <button
                      onClick={() => onResponse(invite.id, 'accept')}
                      className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
                    >
                      Accept
                    </button>

                    {/* Reject button */}
                    <button
                      onClick={() => onResponse(invite.id, 'reject')}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  // If already responded, show status badge
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

          {/* Fallback row when there are no invitations */}
          {invitations.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No invitations on this page.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
