import Button from '../ui/Button';

function Header() {
  return (
    <header className="rounded-b-md bg-white p-2 flex items-center justify-between shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <div></div>
      <div>Tuesday, April 15, 2025</div>
      <Button className="">Create event</Button>
    </header>
  );
}

export default Header;
