// src/pages/EventCreate.tsx

/**
 * EventCreate Component
 *
 * Renders the "Create Event" page, including:
 * - A back navigation link to return to the homepage.
 * - A heading indicating the page purpose.
 * - The CreateForm component for entering event details.
 */

import CreateForm from '../components/pages/event-create/CreateForm'; // Form component for event creation
import { Link } from 'react-router'; // Router link for navigation

export default function EventCreate() {
  return (
    <section
      className="
        flex flex-col items-center space-y-3
        bg-white mt-5 p-4
        border border-gray-200 rounded-md shadow-md
        w-full h-full
      "
    >
      {/* Back link: returns user to the homepage */}
      <Link to="/" className="self-start flex items-center gap-1">
        <span aria-hidden="true">←</span>
        <span className="underline">Back to homepage</span>
      </Link>

      {/* Page title */}
      <h1 className="font-semibold text-3xl">Create Event</h1>

      {/* Event creation form */}
      <CreateForm />
    </section>
  );
}
