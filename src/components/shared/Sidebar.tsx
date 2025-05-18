// src/components/shared/Sidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router'; // Router hooks for navigation and location
import { useDispatch } from 'react-redux'; // Redux hook for dispatching actions
import Button from '../ui/Button'; // Reusable Button component
import { logout } from '../../hooks/redux/slices/user.slice'; // Redux action to clear user state
import useUser from '../../hooks/redux/useUser'; // Custom hook to access authenticated user

//////////////////////
// Prop Definitions //
//////////////////////

/**
 * SidebarProps
 *
 * @property isMobile - Determines styling and close button rendering for mobile view.
 * @property onClose  - Callback to close the sidebar when in mobile mode.
 */
interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

////////////////////////
// Component Definition //
////////////////////////

/**
 * Sidebar
 *
 * Renders the application's navigation sidebar.
 * - Shows a logo and a list of navigation links.
 * - Highlights the active route.
 * - Includes a sign-out button at the bottom.
 * - In mobile mode, renders a close button to collapse the sidebar.
 */
const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onClose }) => {
  const dispatch = useDispatch(); // Dispatch function from Redux
  const location = useLocation(); // Current route location
  const user = useUser(); // Authenticated user object (or null)

  /**
   * handleSignOut
   *
   * Clears user authentication state and navigates to the login page.
   */
  const handleSignOut = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  /**
   * navItems
   *
   * Array of navigation entries.
   * - Always includes common routes.
   * - Conditionally adds the "Admin Settings" link if the user is an admin.
   */
  const navItems = [
    { to: '/', label: 'Homepage', icon: 'dashboard.png' },
    {
      to: '/participate-events',
      label: 'Participate Events',
      icon: 'event.png',
    },
    { to: '/my-events', label: 'My Events', icon: 'event-check.svg' },
    { to: '/invitations', label: 'Invitations', icon: 'inbox.png' },
    { to: '/notifications', label: 'Notifications', icon: 'notification.svg' },
    { to: '/user', label: 'User Info', icon: 'people.png' },
    // Only show Admin Settings for users with "admin" role
    ...(user?.role === 'admin'
      ? [{ to: '/admin', label: 'Admin Settings', icon: 'dashboard.png' }]
      : []),
  ];

  return (
    <aside
      className={`
        flex flex-col justify-between
        bg-white border-r border-gray-200
        p-5 h-full
        ${isMobile ? 'w-64' : 'w-60'}
      `}
    >
      {/* Upper section: logo, close button (mobile), and navigation */}
      <div>
        {/* Mobile close button to collapse the sidebar */}
        {isMobile && (
          <button onClick={onClose} className="mb-4 p-2 focus:outline-none">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Application logo */}
        <img src="/logo.png" alt="App Logo" className="mb-6 w-32" />

        {/* Navigation links */}
        <nav>
          <ul className="space-y-4">
            {navItems.map(({ to, label, icon }) => {
              const isActive = location.pathname === to; // Highlight if route matches
              return (
                <li key={to} className="flex items-center space-x-3">
                  {/* Icon container */}
                  <div className="bg-primary rounded-full p-2">
                    <img src={`/icons/${icon}`} alt={`${label} icon`} />
                  </div>

                  {/* Link text */}
                  <Link
                    to={to}
                    onClick={isMobile ? onClose : undefined} // Close on mobile when navigating
                    className={`
                      font-medium transition-colors
                      ${isActive ? 'text-primary' : 'text-gray-700'}
                    `}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom section: sign-out button */}
      <Button onClick={handleSignOut} className="w-full">
        Sign Out
      </Button>
    </aside>
  );
};

export default Sidebar;
