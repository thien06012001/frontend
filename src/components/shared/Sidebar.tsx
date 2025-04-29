// Corrected import for react-router
import { Link } from 'react-router';
import Button from '../ui/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../../hooks/redux/slices/user.slice';
// Import logout action

const navItems = [
  { to: '/', label: 'Homepage', icon: 'dashboard.png' },
  { to: '/participate-events', label: 'Participate Events', icon: 'event.png' },
  { to: '/my-events', label: 'My Events', icon: 'event.png' },
  { to: '/invitation', label: 'Inbox', icon: 'inbox.png' },
];

function Sidebar() {
  const dispatch = useDispatch();

  // Sign out function
  const handleSignOut = () => {
    // Dispatch the logout action to clear user data from Redux
    dispatch(logout());

    // Optionally, redirect to the login page after signing out
    window.location.href = '/login'; // Or use `navigate('/login')` if using useNavigate from React Router
  };

  return (
    <aside className="p-5 border border-gray-200 flex flex-col justify-between items-center">
      <div>
        <img src="logo.png" alt="logo" />
        <nav>
          <ul className="space-y-4 mt-10">
            {navItems.map(({ to, label, icon }) => (
              <li key={to} className="flex items-center space-x-2">
                <div className="bg-primary rounded-full w-fit p-2">
                  <img src={`icons/${icon}`} alt={`${label} icon`} />
                </div>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </aside>
  );
}

export default Sidebar;
