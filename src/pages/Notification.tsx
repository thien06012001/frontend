// src/pages/NotificationPage.tsx

/**
 * NotificationPage Component
 *
 * Fetches and displays a list of user notifications.
 * - Shows a loading state while fetching.
 * - Displays the count of unread notifications.
 * - Highlights unread notifications.
 * - Links each notification to its related event page.
 */

import { useFetch } from '../hooks/useFetch'; // Custom hook for data fetching
import useUser from '../hooks/redux/useUser'; // Hook to retrieve current user from Redux
import { Notification } from '../types'; // Notification type definition
import { Link } from 'react-router'; // Router Link component for navigation

/**
 * Utility: formatDate
 *
 * Converts an ISO date string to "DD/MM/YYYY" format.
 *
 * @param isoString - ISO-formatted date string
 * @returns Formatted date string
 */
function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function NotificationPage() {
  // Retrieve the logged-in user's ID from Redux store
  const user = useUser();
  const userId = user.id;

  // Fetch notifications for the current user
  const { data, isLoading } = useFetch(`/notifications/user/${userId}`, {
    method: 'GET',
  });

  // Show loading indicator while fetching data
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  // Extract notifications array, defaulting to empty if none
  const notifications: Notification[] = data?.data || [];

  return (
    <div className="p-4 sm:p-5 mt-5 border border-gray-200 shadow-md rounded-md bg-white space-y-4">
      {/* Header: Title and Unread Count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-semibold">Notifications</h1>
        <span className="mt-2 sm:mt-0 text-sm text-gray-600">
          Unread: {notifications.filter(n => !n.isRead).length}
        </span>
      </div>

      <ul className="space-y-3">
        {/* Show placeholder if there are no notifications */}
        {notifications.length === 0 && (
          <p className="text-gray-500 text-sm">No notifications.</p>
        )}

        {/* Render each notification */}
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
              {/* Link to the related event */}
              <Link
                to={`/event/${n.eventId}`}
                className="text-sm font-medium break-words"
              >
                {n.description}
              </Link>
              {/* Metadata: title and formatted date */}
              <div className="text-xs text-gray-400 flex flex-wrap items-center gap-2">
                <span>{n.title}</span>
                <span>•</span>
                <span>{formatDate(n.created_at)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
