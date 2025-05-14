// components/Events.tsx
// ------------------------------------------
// Homepage events listing component
// - Displays a paginated list of upcoming events.
// - Allows users to send, cancel, or leave participation requests.
// - Shows toasts for request actions and simulates approval delays.
// ------------------------------------------

import { useState } from 'react';
import { useToast } from '../../../hooks/context/ToastContext'; // Context hook for global toast notifications
import { Link } from 'react-router'; // Link component for client-side navigation

// Mock data representing all available events.
// In a real app, this would come from an API call.
const allEvents = [
  {
    id: 1,
    title: 'Eid al-Fitr 2024 🕌',
    date: 'April 10, 2024',
    timeRange: '7:00 AM - 12:00 AM',

    location: 'Blue Mosque, Istanbul, Turkey',
    attendees: 70,
  },
  {
    id: 2,
    title: 'Coachella Valley Music & Arts Festival 2024 🎶',
    date: 'June 12, 2024',
    timeRange: '6:00 PM - 10:00 PM',

    location: 'Empire Polo Club, Indio, USA',
    attendees: 20,
  },
  {
    id: 3,
    title: 'Tokyo 2024 Cherry Blossom Festival 🌸',
    date: 'April 15, 2024',
    timeRange: '9:00 AM - 6:00 PM',

    location: 'Shinjuku Gyoen, Tokyo, Japan',
    attendees: 150,
  },
  {
    id: 4,
    title: 'Comic-Con International 2024 🎭',
    date: 'July 23, 2024',
    timeRange: '10:00 AM - 8:00 PM',

    location: 'San Diego Convention Center, San Diego, USA',
    attendees: 250,
  },
  {
    id: 5,
    title: 'Burning Man 2024 🔥',
    date: 'August 25, 2024',
    timeRange: 'All Day',

    location: 'Black Rock City, Nevada, USA',
    attendees: 120,
  },
  {
    id: 6,
    title: 'Lantern Festival 2024 🏮',
    date: 'Feb 24, 2024',
    timeRange: '6:00 PM - 10:00 PM',

    location: 'Chiang Mai, Thailand',
    attendees: 300,
  },
  // Additional mock events may be appended here for testing pagination
];

// Type to track the request status per event ID
interface RequestStatus {
  [eventId: number]: 'none' | 'pending' | 'approved';
}

function Events() {
  // --- Pagination state ---
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;
  const totalPages = Math.ceil(allEvents.length / eventsPerPage);

  // --- Request status & loading state ---
  const [requestStatus, setRequestStatus] = useState<RequestStatus>({});
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);

  // --- Toast notifications from context ---
  const { showToast } = useToast();

  // Compute the events to render on the current page
  const paginatedEvents = allEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  /**
   * Handles click on the Request/Cancel/Leave button.
   * - Shows a loading state.
   * - Toggles between 'none' → 'pending' → 'approved' statuses.
   * - Displays appropriate toast messages.
   */
  const handleRequestAction = async (eventId: number) => {
    setLoadingEventId(eventId);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentStatus = requestStatus[eventId];

    if (currentStatus === 'pending' || currentStatus === 'approved') {
      // Cancel any existing request
      setRequestStatus(prev => ({ ...prev, [eventId]: 'none' }));
      showToast('Request cancelled!', 'info');
    } else {
      // Send a new request
      setRequestStatus(prev => ({ ...prev, [eventId]: 'pending' }));
      showToast('Request sent! Waiting for approval.', 'info');

      // Simulate approval after a short delay
      setTimeout(() => {
        setRequestStatus(prev => ({ ...prev, [eventId]: 'approved' }));
        showToast('Your request was approved!', 'success');
      }, 2000);
    }

    setLoadingEventId(null);
  };

  /**
   * Changes the current page number, respecting bounds [1, totalPages].
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="relative p-5 flex-1 flex flex-col justify-around mt-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Page heading */}
      <h1 className="font-semibold text-3xl mb-5">Homepage</h1>

      {/* Event cards */}
      <div className="flex flex-col space-y-3">
        {paginatedEvents.map(event => {
          const status = requestStatus[event.id] || 'none';
          const isLoading = loadingEventId === event.id;

          // Determine button label & styling based on current status
          let buttonLabel = 'Request';
          let buttonColor = 'bg-blue-500 hover:bg-blue-600';
          if (status === 'pending') {
            buttonLabel = 'Cancel';
            buttonColor = 'bg-red-500 hover:bg-red-600';
          } else if (status === 'approved') {
            buttonLabel = 'Leave';
            buttonColor = 'bg-green-500 hover:bg-green-600';
          }

          return (
            <div
              key={event.id}
              className="flex-1 flex justify-between items-center border border-gray-200 rounded-md p-3"
            >
              {/* Event details */}
              <div className="space-y-1 flex-1">
                <Link to={`/event/${event.id}`} className="font-medium text-lg">
                  {event.title}
                </Link>
                <p className="text-xs text-gray-400">
                  {event.date} – {event.timeRange}
                </p>
                <div className="flex items-center space-x-3 mt-3">
                  {/* Location */}
                  <div className="flex text-xs items-center space-x-1">
                    <img src="/icons/global.png" alt="Location icon" />
                    <span>{event.location}</span>
                  </div>
                  {/* Attendee count */}
                  <div className="flex text-xs items-center space-x-1">
                    <img
                      src="/icons/people.png"
                      alt="Attendees icon"
                      className="size-4"
                    />
                    <span>{event.attendees}</span>
                  </div>
                </div>
              </div>

              {/* Request button */}
              <button
                onClick={() => handleRequestAction(event.id)}
                disabled={isLoading}
                className={`text-white text-sm py-2 px-4 rounded-md transition-all cursor-pointer ${buttonColor} disabled:bg-gray-300`}
              >
                {isLoading ? 'Loading...' : buttonLabel}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-2 pt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded border border-primary hover:bg-primary hover:text-white ${currentPage === page ? 'bg-primary text-white' : ''}`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-primary hover:bg-primary hover:text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default Events;
