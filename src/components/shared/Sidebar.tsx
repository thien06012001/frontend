import { Link, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import Button from '../ui/Button';
import { logout } from '../../hooks/redux/slices/user.slice';
import useUser from '../../hooks/redux/useUser';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useUser();

  const handleSignOut = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

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
    // admin link only if role === 'admin'
    ...(user?.role === 'admin'
      ? [{ to: '/admin', label: 'Admin Settings', icon: 'dashboard.png' }]
      : []),
  ];

  return (
    <aside
      className={`flex flex-col justify-between bg-white border-r border-gray-200 p-5 h-full ${
        isMobile ? 'w-64' : 'w-60'
      }`}
    >
      <div>
        {isMobile && (
          <button onClick={onClose} className="mb-4 p-2 focus:outline-none">
            {/* simple X icon */}
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
        <img src="/logo.png" alt="App Logo" className="mb-6 w-32" />

        <nav>
          <ul className="space-y-4">
            {navItems.map(({ to, label, icon }) => {
              const isActive = location.pathname === to;
              return (
                <li key={to} className="flex items-center space-x-3">
                  <div className="bg-primary rounded-full p-2">
                    <img src={`/icons/${icon}`} alt={`${label} icon`} />
                  </div>
                  <Link
                    to={to}
                    onClick={isMobile ? onClose : undefined}
                    className={`font-medium transition-colors ${
                      isActive ? 'text-primary' : 'text-gray-700'
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

      <Button onClick={handleSignOut} className="w-full">
        Sign Out
      </Button>
    </aside>
  );
}

export default Sidebar;
