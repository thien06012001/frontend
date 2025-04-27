import { Link } from 'react-router';
import Button from '../ui/Button';

function Header() {
  return (
    <header className="rounded-b-md sticky top-0 left-0 w-full bg-white p-1 flex items-center justify-between shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <div></div>
      <div>Tuesday, April 15, 2025</div>
      <Link to={'/create-event'}>
        <Button> Create Event</Button>
      </Link>
    </header>
  );
}

export default Header;
