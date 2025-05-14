// components/ReminderSettings.tsx
// ------------------------------------------
// ReminderSettings Component
// - Configures two sets of reminders:
//   1) “Participation Reminders” sent before event start to joined users
//   2) “Invitation Reminders” sent before event start to invitees who haven’t replied
// - Each set lets you add/remove multiple “days before” values.
// ------------------------------------------

import { useState } from 'react';

type Props = {
  /** ISO date string or human-readable date of the event start */
  eventStartDate: string;
};

export default function ReminderSettings({ eventStartDate }: Props) {
  // Input fields for each reminder type
  const [participantInput, setParticipantInput] = useState('');
  const [invitationInput, setInvitationInput] = useState('');

  // Stored reminder days for each audience
  const [participantReminders, setParticipantReminders] = useState<number[]>(
    [],
  );
  const [invitationReminders, setInvitationReminders] = useState<number[]>([]);

  // Common logic to add a day to a specific list
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

  // Remove a day from a specific list
  const removeReminderDay = (
    day: number,
    list: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    setter(list.filter(d => d !== day));
  };

  // Handle Save — here you might POST to an API instead
  const handleSave = () => {
    console.log('Participant reminders:', participantReminders);
    console.log('Invitation reminders:', invitationReminders);
    alert('Reminder settings saved!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Reminder Settings</h2>
      <p className="text-gray-700">
        Event start date: <strong>{eventStartDate}</strong>
      </p>

      {/* Participation Reminders */}
      <div className="space-y-2">
        <h3 className="font-medium">Participation Reminders</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={participantInput}
            onChange={e => setParticipantInput(e.target.value)}
            placeholder="Days before"
            className="border border-primary p-2 rounded-md w-32 outline-none"
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
            className="bg-primary text-white px-3 py-2 rounded"
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

      {/* Invitation Reminders */}
      <div className="space-y-2">
        <h3 className="font-medium">Invitation Reply Reminders</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={invitationInput}
            onChange={e => setInvitationInput(e.target.value)}
            placeholder="Days before"
            className="border border-primary p-2 rounded-md w-32 outline-none"
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
            className="bg-primary text-white px-3 py-2 rounded"
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

      <button
        onClick={handleSave}
        className="bg-primary text-white px-4 py-2 rounded mt-4"
        disabled={
          participantReminders.length === 0 && invitationReminders.length === 0
        }
      >
        Save All Reminders
      </button>
    </div>
  );
}
