// src/pages/Home.tsx

import { useEffect, useState } from 'react';
import useUser from '../hooks/redux/useUser';
import { handleAPI } from '../handlers/api-handler';
import { Event, Request } from '../types';
import Events from '../components/pages/home/Events';
import Pagination from '../components/pages/home/Pagination';

/**
 * Homepage component displays a paginated list of events
 * and allows the user to request, cancel, or leave events.
 */
export default function Home() {
  // State: full list of events fetched from API
  const [events, setEvents] = useState<Event[]>([]);

  // Get current user from Redux store
  const user = useUser();
  const userId = user.id;

  /**
   * Parse initial page number from URL query string (default to 1)
   */
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  };

  // State: current page for pagination
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  // State: input value for manual page entry
  const [inputPage, setInputPage] = useState(getInitialPage);
  // Constant: number of events per page
  const eventsPerPage = 3;

  /**
   * Fetch all events on component mount
   */
  useEffect(() => {
    (async () => {
      try {
        const res = await handleAPI('/events', { method: 'GET' });
        if (!res.ok) return; // Early exit on error
        const { data } = (await res.json()) as { data: Event[] };
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    })();
  }, []);

  /**
   * Sync URL query and input field when currentPage changes
   */
  useEffect(() => {
    setInputPage(currentPage);
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(currentPage));
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  }, [currentPage]);

  // Calculate total number of pages based on events count
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Derive events for current page slice
  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  /**
   * Change page handler: validates page bounds before updating
   */
  const changePage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    setCurrentPage(p);
  };

  /**
   * Handle user actions on events: request, cancel, or leave
   * Updates state optimistically based on API response
   */
  const handleRequestAction = async (
    eventId: string,
    action: 'request' | 'cancel' | 'leave',
  ) => {
    try {
      if (action === 'request') {
        const res = await handleAPI('/requests', {
          method: 'POST',
          body: JSON.stringify({ eventId, userId }),
        });
        if (!res.ok) return;
        const { data: newRequest } = (await res.json()) as { data: Request };

        // Append new request to the event
        setEvents(prev =>
          prev.map(ev =>
            ev.id !== eventId
              ? ev
              : { ...ev, requests: [...ev.requests, newRequest] },
          ),
        );
      } else if (action === 'cancel') {
        const res = await handleAPI(
          `/requests?userId=${userId}&eventId=${eventId}`,
          { method: 'DELETE' },
        );
        if (!res.ok) return;

        // Remove the cancelled request from the event
        setEvents(prev =>
          prev.map(ev =>
            ev.id !== eventId
              ? ev
              : {
                  ...ev,
                  requests: ev.requests.filter(
                    r => !(r.user_id === userId && r.event_id === eventId),
                  ),
                },
          ),
        );
      } else {
        // 'leave' action: remove user from participants list
        const res = await handleAPI(`/events/${eventId}/leave`, {
          method: 'POST',
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) return;

        setEvents(prev =>
          prev.map(ev =>
            ev.id !== eventId
              ? ev
              : {
                  ...ev,
                  participants: ev.participants.filter(p => p.id !== userId),
                },
          ),
        );
      }
    } catch (error) {
      console.error(`Error performing '${action}' on event ${eventId}:`, error);
    }
  };

  return (
    <section className="p-5 flex-1 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm space-y-6 mt-5">
      <h1 className="text-2xl md:text-3xl font-semibold">Homepage</h1>

      {/* Render event cards with action callbacks */}
      <Events
        events={paginatedEvents}
        userId={userId}
        onAction={handleRequestAction}
      />

      {/* Render pagination controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        inputPage={inputPage}
        onInputChange={setInputPage}
        onPageChange={changePage}
      />
    </section>
  );
}
