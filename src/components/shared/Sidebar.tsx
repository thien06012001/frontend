import { Link, useLocation } from 'react-router';
import Button from '../ui/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../../hooks/redux/slices/user.slice';

const navItems = [
  { to: '/', label: 'Homepage', icon: 'dashboard.png' },
  { to: '/participate-events', label: 'Participate Events', icon: 'event.png' },
  { to: '/my-events', label: 'My Events', icon: 'event-check.svg' },
  { to: '/invitations', label: 'Invitations', icon: 'inbox.png' },
  { to: '/notifications', label: 'Notifications', icon: 'notification.svg' },
];

function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSignOut = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <aside className="p-5 border border-gray-200 flex flex-col justify-between items-center">
      <div>
        <img src="/logo.png" alt="logo" />
        <nav>
          <ul className="space-y-4 mt-10">
            {navItems.map(({ to, label, icon }) => {
              const isActive = location.pathname === to;
              return (
                <li key={to} className="flex items-center space-x-2">
                  <div className="bg-primary rounded-full w-fit p-2">
                    <img src={`/icons/${icon}`} alt={`${label} icon`} />
                  </div>
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
      <Button onClick={handleSignOut}>Sign Out</Button>
    </aside>
  );
}

export default Sidebar;
