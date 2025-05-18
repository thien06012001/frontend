// src/components/pages/invitations/InvitationTable.tsx

import { Invitation } from '../../../types'; // Type definition for invitation data
import { formatDate } from '../../../libs/utils'; // Utility to format ISO date strings

/**
 * Props for InvitationTable
 *
 * @property invitations - Array of Invitation objects to render
 * @property onResponse  - Callback invoked when accepting or rejecting an invitation
 */
interface InvitationTableProps {
  invitations: Invitation[];
  onResponse: (id: string, action: 'accept' | 'reject') => void;
}

/**
 * InvitationTable
 *
 * Renders a responsive table of event invitations with actions.
 * - Displays event name, invitation date, event date.
 * - Shows "Accept" and "Reject" buttons for pending invites.
 * - Shows a status badge for already responded invites.
 */
export default function InvitationTable({
  invitations,
  onResponse,
}: InvitationTableProps) {
  return (
    // Enable horizontal scroll on narrow viewports
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] table-auto border border-gray-200 text-sm rounded-md">
        {/* Table header */}
        <thead className="bg-gray-100 text-left">
          <tr>
            {/* Event Name column */}
            <th className="w-[35%] px-4 py-2">Event Name</th>
            {/* Invitation date column, hidden on very small screens */}
            <th className="hidden sm:table-cell w-[20%] px-4 py-2">
              Invited At
            </th>
            {/* Event start date column */}
            <th className="w-[20%] px-4 py-2">Event Date</th>
            {/* Actions column for accept/reject buttons or status badge */}
            <th className="w-[25%] px-4 py-2">Actions</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {invitations.map(invite => (
            <tr key={invite.id} className="border-t border-gray-200">
              {/* Event name cell */}
              <td className="px-4 py-2">{invite.event.name}</td>

              {/* Invitation creation date cell (hidden on small screens) */}
              <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap">
                {formatDate(invite.created_at)}
              </td>

              {/* Event start time cell */}
              <td className="px-4 py-2 whitespace-nowrap">
                {formatDate(invite.event.start_time)}
              </td>

              {/* Actions cell */}
              <td className="px-4 py-2 space-x-2 flex flex-wrap">
                {invite.status === 'pending' ? (
                  <>
                    {/* Accept button for pending invitations */}
                    <button
                      onClick={() => onResponse(invite.id, 'accept')}
                      className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
                    >
                      Accept
                    </button>

                    {/* Reject button for pending invitations */}
                    <button
                      onClick={() => onResponse(invite.id, 'reject')}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  // Status badge for accepted or rejected invitations
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
