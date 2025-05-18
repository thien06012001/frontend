// src/components/shared/Header.tsx
import { Link } from 'react-router'; // Router Link component for navigation
import Button from '../ui/Button'; // Reusable button component

/**
 * Header Component
 *
 * Renders a sticky header for desktop view with:
 * - The current date formatted as a full weekday + date.
 * - A "Create Event" button that navigates to the event creation page.
 */
function Header() {
  return (
    <header
      className="
        hidden md:flex                       /* Show only on medium+ screens */
        md:rounded                           /* Rounded corners on md+ */
        items-center justify-between         /* Horizontal layout */
        bg-white p-2                         /* White background and padding */
        sticky top-0 z-10                    /* Stick to top with higher stacking context */
        shadow-sm                            /* Subtle drop shadow */
      "
    >
      {/* Display today's date in "Weekday, Month Day, Year" format */}
      <div className="text-gray-600 font-medium">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      {/* Link to the Create Event page */}
      <Link to="/create-event">
        <Button>Create Event</Button>
      </Link>
    </header>
  );
}

export default Header;
