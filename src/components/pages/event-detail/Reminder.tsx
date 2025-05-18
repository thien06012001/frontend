// src/components/pages/event-detail/ReminderSettings.tsx

import { useState } from 'react';
import { useParams } from 'react-router'; // Hook to read URL params
import { handleAPI } from '../../../handlers/api-handler'; // API helper for HTTP requests
import { useToast } from '../../../hooks/context/ToastContext'; // Toast context for notifications
import { formatDate } from '../../../libs/utils'; // Utility to format dates
import Button from '../../ui/Button'; // Reusable Button component

/**
 * Props for ReminderSettings component
 *
 * @param eventStartDate      - ISO string of the event's start date
 * @param invitationReminder  - Initial days-before reminder for invitations
 * @param participantReminder - Initial days-before reminder for participants
 */
type Props = {
  eventStartDate: string;
  invitationReminder: number;
  participantReminder: number;
};

/**
 * ReminderSettings
 *
 * Allows the organizer to configure reminder lead times for:
 *  - Participation reminders (before the event start date)
 *  - Invitation reply reminders (before the event start date)
 *
 * Sends updated settings to the server and shows toast notifications.
 */
export default function ReminderSettings({
  eventStartDate,
  invitationReminder,
  participantReminder,
}: Props) {
  const { id } = useParams<{ id: string }>(); // Extract event ID from URL

  // Local state for input fields, initialized from props
  const [participantInput, setParticipantInput] = useState(participantReminder);
  const [invitationInput, setInvitationInput] = useState(invitationReminder);

  const { showToast } = useToast(); // Toast function to show feedback

  /**
   * handleSave
   *
   * Sends a PUT request to update reminder settings on the server.
   * - On success: shows a success toast.
   * - On failure: shows an error toast with the server message.
   */
  const handleSave = async () => {
    const response = await handleAPI(`/events/${id}/reminder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantReminder: participantInput,
        invitationReminder: invitationInput,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      // Display server error message
      showToast(result.message, 'error');
      return;
    }
    // Notify user of successful save
    showToast('Reminders saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Section title */}
      <h2 className="text-xl font-semibold">Reminder Settings</h2>

      {/* Display formatted event start date */}
      <p className="text-gray-700">
        Event start date: <strong>{formatDate(eventStartDate)}</strong>
      </p>

      {/* Input fields for reminder days */}
      <div className="flex justify-center items-center flex-wrap gap-8">
        {/* Participation Reminders */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Participation Reminders</h3>
          <input
            type="number"
            min={1}
            value={participantInput}
            onChange={e => setParticipantInput(Number(e.target.value))}
            placeholder="Days before (press Enter)"
            className="w-full border border-primary p-2 rounded-md outline-none"
          />
        </div>

        {/* Invitation Reply Reminders */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Invitation Reply Reminders</h3>
          <input
            type="number"
            min={1}
            value={invitationInput}
            onChange={e => setInvitationInput(Number(e.target.value))}
            placeholder="Days before (press Enter)"
            className="w-full border border-primary p-2 rounded-md outline-none"
          />
        </div>
      </div>

      {/* Save button aligned to the right */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-primary text-white px-6 py-2 rounded-md disabled:opacity-50"
        >
          Save All Reminders
        </Button>
      </div>
    </div>
  );
}
