// components/NotificationPage.tsx
// ------------------------------------------
// NotificationPage Component
// - Displays user notifications: updates, event reminders, and invitation requests.
// - Tracks read/unread state and shows unread count.
// - Allows marking non-invitation notifications as read.
// - For invitation notifications, presents “Accept” and “Deny” actions.
// ------------------------------------------

import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import Button from '../components/ui/Button';

// Extend Notification type to include invitation requests
interface Notification {
  id: string;
  eventId: string;
  message: string;
  type: 'Update' | 'Reminder' | 'Invitation';
  date: string; // Notification creation date
  eventDate: string; // Actual event date
  read: boolean; // Whether the user has read this notification
}

// Mock data including an invitation notification
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
    message: 'You have been invited to Lantern Festival 2024 🏮.',
    type: 'Invitation',
    date: 'Feb 20, 2024',
    eventDate: 'Feb 24, 2024',
    read: false,
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
  // Local state for notifications list
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  // Toast hook for feedback messages
  // const { showToast } = useToast();

  // Compute number of unread notifications
  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications],
  );

  /**
   * Mark a notification as read.
   * @param id Notification ID to mark read
   */
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  /**
   * Accept an invitation.
   * Marks notification as read and shows a success toast.
   * @param id Notification ID for invitation
   */
  const handleAccept = (id: string) => {
    markAsRead(id);

    // TODO: call API to confirm invitation acceptance
  };

  /**
   * Deny an invitation.
   * Marks notification as read and shows an info toast.
   * @param id Notification ID for invitation
   */
  const handleDeny = (id: string) => {
    markAsRead(id);

    // TODO: call API to decline invitation
  };

  return (
    <div className="p-5 mt-5 border border-gray-200 shadow-md rounded-md space-y-4 bg-white">
      {/* Header with unread count */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Notifications</h1>
        {unreadCount > 0 && (
          <span className="text-sm text-gray-500">{unreadCount} unread</span>
        )}
      </div>

      {/* Notification list */}
      <ul className="space-y-2">
        {notifications.length === 0 && (
          <p className="text-gray-500 text-sm">No notifications.</p>
        )}

        {notifications.map(n => (
          <li
            key={n.id}
            className={`
              flex justify-between items-start
              border border-gray-200 p-3 rounded-md
              ${!n.read ? 'bg-yellow-50' : 'bg-white'}
            `}
          >
            {/* Main content: link to event and message */}
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

            {/* Action buttons */}
            <div className="flex flex-col space-y-2">
              {/* Invitations get Accept/Deny */}
              {n.type === 'Invitation' && !n.read && (
                <>
                  <Button
                    onClick={() => handleAccept(n.id)}
                    className="px-2 py-1 text-xs rounded bg-green-500 text-white"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDeny(n.id)}
                    className="px-2 py-1 text-xs rounded bg-red-500 text-white"
                  >
                    Deny
                  </Button>
                </>
              )}

              {/* Other unread notifications get a “Mark as read” link */}
              {n.type !== 'Invitation' && !n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationPage;
