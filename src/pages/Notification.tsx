// components/NotificationPage.tsx
// ------------------------------------------
// NotificationPage Component
// - Displays user notifications: updates, event reminders, and invitation requests.
// - Tracks read/unread state and shows unread count.
// - Allows marking non-invitation notifications as read.
// - For invitation notifications, presents “Accept” and “Deny” actions.
// ------------------------------------------

import { Link } from 'react-router';
import Button from '../components/ui/Button';
import { useFetch } from '../hooks/useFetch';
import useUser from '../hooks/redux/useUser';
import { Notification } from '../types';

// Mock data including an invitation notification

function NotificationPage() {
  const user = useUser();
  const userId = user.id;

  const { data, isLoading } = useFetch(`/notifications/user/${userId}`, {
    method: 'GET',
  });

  if (!data && isLoading) {
    return <div>loading...</div>;
  }

  const notifications: Notification[] = data?.data || [];
  console.log('notifications', notifications);
  return (
    <div className="p-5 mt-5 border border-gray-200 shadow-md rounded-md space-y-4 bg-white">
      {/* Header with unread count */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Notifications</h1>
      </div>

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
              ${!n.isRead ? 'bg-yellow-50' : 'bg-white'}
            `}
          >
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-lg font-semibold">{n.description}</span>
              </p>
              <div className="text-xs text-gray-400 flex gap-2">
                <span>{n.title}</span>
                <span>•</span>
                <span>{n.created_at}</span>
              </div>
            </div>

            {/* <div className="flex flex-col space-y-2">
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

              {n.type !== 'Invitation' && !n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationPage;
