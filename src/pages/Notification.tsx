import { useState, useMemo } from 'react';
import { Link } from 'react-router';

interface Notification {
  id: string;
  eventId: string;
  message: string;
  type: 'Update' | 'Reminder';
  date: string; // Notification creation date
  eventDate: string; // Actual event date
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    eventId: 'eid-fitr-2024',
    message: 'The time for Eid al-Fitr 2024 🕌 has been updated.',
    type: 'Update',
    date: 'Apr 07, 2024',
    eventDate: 'Apr 10, 2024',
    read: false,
  },
  {
    id: '2',
    eventId: 'eid-fitr-2024',
    message: 'Reminder: Eid al-Fitr 2024 🕌 is in 3 days.',
    type: 'Reminder',
    date: 'Apr 07, 2024',
    eventDate: 'Apr 10, 2024',
    read: false,
  },
  {
    id: '3',
    eventId: 'lantern-2024',
    message: 'Reminder: Lantern Festival 2024 🏮 is tomorrow!',
    type: 'Reminder',
    date: 'Feb 23, 2024',
    eventDate: 'Feb 24, 2024',
    read: true,
  },
  {
    id: '4',
    eventId: 'coachella-2024',
    message: 'Event Coachella 2024 🎶 location has changed.',
    type: 'Update',
    date: 'May 01, 2024',
    eventDate: 'June 02, 2024',
    read: true,
  },
];

function NotificationPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications],
  );

  return (
    <div className="p-5 mt-5 border border-gray-200 shadow-md rounded-md space-y-4 bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Notifications</h1>
        {unreadCount > 0 && (
          <span className="text-sm text-gray-500">{unreadCount} unread</span>
        )}
      </div>

      <ul className="space-y-2">
        {notifications.length === 0 && (
          <p className="text-gray-500 text-sm">No notifications.</p>
        )}

        {notifications.map(n => (
          <li
            key={n.id}
            className={`flex justify-between items-start border border-gray-200 p-3 rounded-md ${
              !n.read ? 'bg-yellow-50' : 'bg-white'
            }`}
          >
            <div className="space-y-1">
              <p className="text-sm">
                <Link
                  to={`/event/${n.eventId}`}
                  className="text-blue-600 hover:underline"
                >
                  {n.message}
                </Link>
              </p>
              <div className="text-xs text-gray-400 flex gap-2">
                <span>{n.type}</span>
                <span>•</span>
                <span>{n.date}</span>
              </div>
            </div>
            {!n.read && (
              <button
                onClick={() => markAsRead(n.id)}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationPage;
