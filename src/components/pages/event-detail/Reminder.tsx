import { useState } from 'react';

type Props = {
  /** ISO date string or human-readable date of the event start */
  eventStartDate: string;
};

export default function ReminderSettings({ eventStartDate }: Props) {
  const [participantInput, setParticipantInput] = useState('');
  const [invitationInput, setInvitationInput] = useState('');
  const [participantReminders, setParticipantReminders] = useState<number[]>(
    [],
  );
  const [invitationReminders, setInvitationReminders] = useState<number[]>([]);

  const addReminderDay = (
    rawValue: string,
    list: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>,
    clearInput: () => void,
  ) => {
    const day = parseInt(rawValue.trim(), 10);
    if (isNaN(day) || day <= 0) {
      alert('Please enter a valid positive number');
      return;
    }
    if (list.includes(day)) {
      alert('This day is already added');
      return;
    }
    setter(prev => [...prev, day].sort((a, b) => b - a));
    clearInput();
  };

  const removeReminderDay = (
    day: number,
    list: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    setter(list.filter(d => d !== day));
  };

  const handleSave = () => {
    console.log('Participant reminders:', participantReminders);
    console.log('Invitation reminders:', invitationReminders);
    alert('Reminder settings saved!');
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <h2 className="text-xl font-semibold">Reminder Settings</h2>
      <p className="text-gray-700">
        Event start date: <strong>{eventStartDate}</strong>
      </p>

      {/* Two-column layout on sm+ */}
      <div className="flex justify-center items-center flex-wrap gap-8">
        {/* Participation Reminders */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Participation Reminders</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="number"
              min={1}
              value={participantInput}
              onChange={e => setParticipantInput(e.target.value)}
              placeholder="Days before"
              className="flex-1 border border-primary p-2 rounded-md outline-none"
            />
            <button
              onClick={() =>
                addReminderDay(
                  participantInput,
                  participantReminders,
                  setParticipantReminders,
                  () => setParticipantInput(''),
                )
              }
              className="bg-primary text-white px-4 py-2 rounded-md whitespace-nowrap"
            >
              Add
            </button>
          </div>
          {participantReminders.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {participantReminders.map(day => (
                <li
                  key={`p-${day}`}
                  className="flex justify-between items-center"
                >
                  <span>
                    {day} day{day > 1 ? 's' : ''} before event
                  </span>
                  <button
                    onClick={() =>
                      removeReminderDay(
                        day,
                        participantReminders,
                        setParticipantReminders,
                      )
                    }
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No participation reminders added.
            </p>
          )}
        </div>

        {/* Invitation Reply Reminders */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Invitation Reply Reminders</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="number"
              min={1}
              value={invitationInput}
              onChange={e => setInvitationInput(e.target.value)}
              placeholder="Days before"
              className="flex-1 border border-primary p-2 rounded-md outline-none"
            />
            <button
              onClick={() =>
                addReminderDay(
                  invitationInput,
                  invitationReminders,
                  setInvitationReminders,
                  () => setInvitationInput(''),
                )
              }
              className="bg-primary text-white px-4 py-2 rounded-md whitespace-nowrap"
            >
              Add
            </button>
          </div>
          {invitationReminders.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {invitationReminders.map(day => (
                <li
                  key={`i-${day}`}
                  className="flex justify-between items-center"
                >
                  <span>
                    {day} day{day > 1 ? 's' : ''} before event
                  </span>
                  <button
                    onClick={() =>
                      removeReminderDay(
                        day,
                        invitationReminders,
                        setInvitationReminders,
                      )
                    }
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No invitation reminders added.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={
            participantReminders.length === 0 &&
            invitationReminders.length === 0
          }
          className="bg-primary text-white px-6 py-2 rounded-md disabled:opacity-50"
        >
          Save All Reminders
        </button>
      </div>
    </div>
  );
}
