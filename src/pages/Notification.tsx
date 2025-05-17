//src/pages/NotificationPage.tsx

import { useFetch } from '../hooks/useFetch';
import useUser from '../hooks/redux/useUser';
import { Notification } from '../types';

/** Format ISO date string to DD/MM/YYYY */
function formatDate(isoString: string) {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function NotificationPage() {
  const user = useUser();
  const userId = user.id;

  const { data, isLoading } = useFetch(`/notifications/user/${userId}`, {
    method: 'GET',
  });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }
  const notifications: Notification[] = data?.data || [];

  return (
    <div className="p-4 sm:p-5 mt-5 border border-gray-200 shadow-md rounded-md bg-white space-y-4">
      {/* Header with unread count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-semibold">Notifications</h1>
        <span className="mt-2 sm:mt-0 text-sm text-gray-600">
          Unread: {notifications.filter(n => !n.isRead).length}
        </span>
      </div>

      <ul className="space-y-3">
        {notifications.length === 0 && (
          <p className="text-gray-500 text-sm">No notifications.</p>
        )}

        {notifications.map(n => (
          <li
            key={n.id}
            className={`
              flex flex-col sm:flex-row sm:justify-between
              border border-gray-200 p-4 rounded-md
              ${!n.isRead ? 'bg-yellow-50' : 'bg-white'}
            `}
          >
            <div className="space-y-1">
              <p className="text-sm font-medium break-words">{n.description}</p>
              <div className="text-xs text-gray-400 flex flex-wrap items-center gap-2">
                <span>{n.title}</span>
                <span>•</span>
                <span>{formatDate(n.created_at)}</span>
              </div>
            </div>

            {/* Invitation actions could go here; for now we just show status */}
            {/* {n.type === 'invitation' && (
              <div className="mt-3 sm:mt-0 flex gap-2">
                <button className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm">
                  Accept
                </button>
                <button className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm">
                  Deny
                </button>
              </div>
            )} */}
          </li>
        ))}
      </ul>
    </div>
  );
}
