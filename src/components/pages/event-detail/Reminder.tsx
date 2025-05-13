import { useState } from 'react';

type Props = {
  eventStartDate: string;
};

function Reminder({ eventStartDate }: Props) {
  const [daysInput, setDaysInput] = useState('');
  const [reminderDays, setReminderDays] = useState<number[]>([]);

  const handleAddDay = () => {
    const day = parseInt(daysInput.trim());
    if (isNaN(day) || day <= 0) {
      alert('Please enter a valid positive number');
      return;
    }
    if (reminderDays.includes(day)) {
      alert('This day is already added');
      return;
    }

    setReminderDays(prev => [...prev, day].sort((a, b) => b - a));
    setDaysInput('');
  };

  const handleRemoveDay = (day: number) => {
    setReminderDays(prev => prev.filter(d => d !== day));
  };

  const handleSubmit = () => {
    console.log('Saved reminder days:', reminderDays);
    alert('Reminder settings saved!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Reminder Settings</h2>

      <p className="text-gray-700">
        Event start date: <strong>{eventStartDate}</strong>
      </p>

      {/* Input for adding reminder day */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={daysInput}
          onChange={e => setDaysInput(e.target.value)}
          placeholder="Days before"
          className="border border-primary p-2 rounded-md w-32 outline-none"
          min={1}
        />
        <button
          onClick={handleAddDay}
          className="bg-primary text-white px-3 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Display current reminder days */}
      {reminderDays.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {reminderDays.map(day => (
            <li key={day} className="flex justify-between items-center">
              <span>
                Reminder {day} day{day > 1 ? 's' : ''} before event
              </span>
              <button
                onClick={() => handleRemoveDay(day)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No reminders added yet.</p>
      )}

      <button
        onClick={handleSubmit}
        className="bg-primary text-white px-4 py-2 rounded mt-2"
        disabled={reminderDays.length === 0}
      >
        Save Reminders
      </button>
    </div>
  );
}

export default Reminder;
