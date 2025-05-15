import { Link } from 'react-router';
import Button from '../ui/Button';

function Header() {
  return (
    <header className="hidden md:flex md:rounded items-center justify-between bg-white p-2 sticky top-0 z-10 shadow-sm">
      {/* dynamic date */}
      <div className="text-gray-600 font-medium">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <Link to="/create-event">
        <Button>Create Event</Button>
      </Link>
    </header>
  );
}

export default Header;
