import { Link } from 'react-router';
import Button from '../ui/Button';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard.png' },
  { to: '/event', label: 'Event Tracking', icon: 'event.png' },
  { to: '/inbox', label: 'Inbox', icon: 'inbox.png' },
];

function Sidebar() {
  return (
    <aside className="p-5 border border-gray-200 flex flex-col justify-between items-center">
      <div>
        <img src="logo.png" alt="logo" />
        <nav>
          <ul className="space-y-4 mt-10">
            {navItems.map(({ to, label, icon }) => (
              <li key={to} className="flex items-center space-x-2">
                <div className="bg-[#FF9870] rounded-full w-fit p-2">
                  <img src={`icons/${icon}`} alt={`${label} icon`} />
                </div>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Button>Sign Out</Button>
    </aside>
  );
}

export default Sidebar;
