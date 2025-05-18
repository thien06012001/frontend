import { useState } from 'react';
import { useParams } from 'react-router';
import { handleAPI } from '../../../handlers/api-handler';
import { useToast } from '../../../hooks/context/ToastContext';
import { formatDate } from '../../../libs/utils'; // ← import here
import Button from '../../ui/Button';

type Props = {
  eventStartDate: string;
  invitationReminder: number;
  participantReminder: number;
};

export default function ReminderSettings({
  eventStartDate,
  invitationReminder,
  participantReminder,
}: Props) {
  const { id } = useParams();
  const [participantInput, setParticipantInput] = useState(participantReminder);
  const [invitationInput, setInvitationInput] = useState(invitationReminder);
  const { showToast } = useToast();

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
      showToast(result.message, 'error');
      return;
    }
    showToast('Reminders saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <h2 className="text-xl font-semibold">Reminder Settings</h2>
      <p className="text-gray-700">
        Event start date: <strong>{formatDate(eventStartDate)}</strong>
      </p>

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
