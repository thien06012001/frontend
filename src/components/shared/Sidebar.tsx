// components/Sidebar.tsx
// ------------------------------------------
// Sidebar navigation component
// - Displays a logo and a set of navigation links.
// - Conditionally shows the “Admin Settings” link only to admin users.
// - Provides a Sign Out button to clear the session and redirect to login.
// ------------------------------------------

import { Link, useLocation } from 'react-router'; // Router hooks for navigation and active-link detection
import { useSelector, useDispatch } from 'react-redux'; // Hooks to interact with Redux store
import Button from '../ui/Button'; // Reusable button UI component
import { logout } from '../../hooks/redux/slices/user.slice'; // Redux action to clear user session
import { RootState } from '../../hooks/redux/store'; // Type for the root Redux state

// Define all possible navigation items in the sidebar.
// Each item has a target route, display label, and associated icon.
const navItems = [
  { to: '/', label: 'Homepage', icon: 'dashboard.png' },
  { to: '/participate-events', label: 'Participate Events', icon: 'event.png' },
  { to: '/my-events', label: 'My Events', icon: 'event-check.svg' },
  { to: '/invitations', label: 'Invitations', icon: 'inbox.png' },
  { to: '/notifications', label: 'Notifications', icon: 'notification.svg' },
  { to: '/admin', label: 'Admin Settings', icon: 'dashboard.png' },
];

function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.users.user);

  /**
   * Sign out the current user:
   * - Dispatches the logout action to clear Redux state.
   * - Redirects browser to the login page.
   */
  const handleSignOut = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  /**
   * Filter navigation items:
   * - Exclude the Admin Settings link for non-admin users.
   */
  const filteredNav = navItems.filter(
    item => item.to !== '/admin' || user?.role === 'admin',
  );

  return (
    <aside className="p-5 border border-gray-200 flex flex-col justify-between items-center">
      {/* Logo / Branding */}
      <div>
        <img src="/logo.png" alt="App Logo" />

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-4 mt-10">
            {filteredNav.map(({ to, label, icon }) => {
              const isActive = location.pathname === to;

              return (
                <li key={to} className="flex items-center space-x-2">
                  {/* Icon container */}
                  <div className="bg-primary rounded-full w-fit p-2">
                    <img src={`/icons/${icon}`} alt={`${label} icon`} />
                  </div>

                  {/* Text link, highlights when active */}
                  <Link
                    to={to}
                    className={`font-medium transition-colors ${
                      isActive ? 'text-primary font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Sign Out button at bottom of sidebar */}
      <Button onClick={handleSignOut}>Sign Out</Button>
    </aside>
  );
}

export default Sidebar;
