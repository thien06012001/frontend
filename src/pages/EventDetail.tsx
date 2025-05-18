// src/pages/EventDetail.tsx

/**
 * EventDetail Component
 *
 * Displays detailed information about a single event.
 * - Fetches event data by ID from the URL.
 * - Determines user role (organizer, participant, or visitor).
 * - Renders different tabs (Info, Members, Requests, Discussions, Invitations, Reminders).
 * - Synchronizes the active tab with the `tab` query parameter.
 */

import { useMemo, useState, useEffect } from 'react'; // React hooks
import { useParams, Link, useSearchParams } from 'react-router'; // Router hooks and components
import Info from '../components/pages/event-detail/Info'; // Event info view
import JoinedMembers from '../components/pages/event-detail/JoinedMembers'; // Organizer’s member list
import Requests from '../components/pages/event-detail/Requests'; // Organizer’s request list
import Invitations from '../components/pages/event-detail/Invitations'; // Organizer’s invitation list
import Reminder from '../components/pages/event-detail/Reminder'; // Organizer’s reminder settings
import Discussion from '../components/pages/event-detail/Discussion'; // Discussion board view
import { Event } from '../types'; // Event data type
import { useFetch } from '../hooks/useFetch'; // Data fetching hook
import useUser from '../hooks/redux/useUser'; // Redux user hook

// Define the possible tab views for organizers and participants
type OrganizerView =
  | 'info'
  | 'members'
  | 'requests'
  | 'invitations'
  | 'reminders'
  | 'discussions';

export default function EventDetail() {
  // Retrieve event ID from URL parameters
  const { id } = useParams();

  // Fetch event data; `data.data` should conform to the Event type
  const { data, isLoading } = useFetch(`/events/${id}`, { method: 'GET' });
  const event = data?.data as Event;

  // Manage query parameters for tab navigation
  const [searchParams, setSearchParams] = useSearchParams();

  // Retrieve current user info from Redux
  const user = useUser();
  const currentUserId = user?.id || '';

  // Determine if the current user is the event organizer or an admin
  const isOrganizer =
    Boolean(event && event.owner_id === currentUserId) ||
    user?.role === 'admin';

  /**
   * Compute which tabs should be visible based on user role:
   * - Organizers see all tabs
   * - Others see Info and Discussions only
   */
  const allowedTabs = useMemo<OrganizerView[]>(
    () =>
      isOrganizer
        ? [
            'info',
            'members',
            'requests',
            'discussions',
            'invitations',
            'reminders',
          ]
        : ['info', 'discussions'],
    [isOrganizer],
  );

  // Track the currently active tab view
  const [activeView, setActiveView] = useState<OrganizerView>('info');

  /**
   * Initialize or update the activeView based on the `tab` parameter.
   * If the tab is not allowed, reset to 'info'.
   */
  useEffect(() => {
    if (!isLoading && event) {
      const requestedTab = (searchParams.get('tab') as OrganizerView) || 'info';
      if (allowedTabs.includes(requestedTab)) {
        setActiveView(requestedTab);
      } else {
        setSearchParams({ tab: 'info' });
        setActiveView('info');
      }
    }
  }, [isLoading, event, allowedTabs, searchParams, setSearchParams]);

  // Show loading state while fetching event data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle case where event is not found
  if (!event) {
    return <div>Event not found</div>;
  }

  // Determine if the user is a participant (including organizer)
  const isParticipant =
    !!event.participants?.some(p => p.id === currentUserId) ||
    event.owner_id === currentUserId;

  // Handler to change the active tab and update the URL parameter
  const handleTabChange = (tab: OrganizerView) => {
    setActiveView(tab);
    setSearchParams({ tab });
  };

  /**
   * Define navigation buttons based on user role:
   * - Organizers get all tabs
   * - Participants get Info + Discussions
   * - Visitors get Info only
   */
  const navButtons: { label: string; value: OrganizerView }[] = isOrganizer
    ? [
        { label: 'Info', value: 'info' },
        { label: 'Joined Members', value: 'members' },
        { label: 'Requests', value: 'requests' },
        { label: 'Discussions', value: 'discussions' },
        { label: 'Invitations', value: 'invitations' },
        { label: 'Send Reminder', value: 'reminders' },
      ]
    : isParticipant
      ? [
          { label: 'Info', value: 'info' },
          { label: 'Discussions', value: 'discussions' },
        ]
      : [{ label: 'Info', value: 'info' }];

  // Convenience list of participants
  const participants = event.participants || [];

  /**
   * Render the section corresponding to the active tab.
   */
  const renderSection = () => {
    switch (activeView) {
      case 'info':
        return <Info event={event} isOrganizer={isOrganizer} />;
      case 'members':
        return isOrganizer ? (
          <JoinedMembers participants={participants} />
        ) : null;
      case 'requests':
        return isOrganizer ? <Requests /> : null;
      case 'discussions':
        return <Discussion isOrganizer={isOrganizer} />;
      case 'invitations':
        return isOrganizer ? <Invitations /> : null;
      case 'reminders':
        return isOrganizer ? (
          <Reminder
            invitationReminder={event.invitationReminder}
            participantReminder={event.participantReminder}
            eventStartDate={event.start_time}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="p-5 mt-5 border border-gray-200 shadow-md rounded-md">
      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb">
        <Link to="/" className="text-primary underline">
          &larr; Back to Homepage
        </Link>
      </nav>

      {/* Responsive tab navigation */}
      <div className="mt-4">
        {/* Mobile: dropdown selector */}
        <div className="sm:hidden">
          <select
            value={activeView}
            onChange={e => handleTabChange(e.target.value as OrganizerView)}
            className="w-full border border-primary rounded-md p-2 bg-primary/5 text-sm"
          >
            {navButtons.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: horizontal tab buttons */}
        <nav className="hidden sm:flex gap-3 text-sm font-medium border border-primary bg-primary/5 p-3 rounded-md flex-wrap">
          {navButtons.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={activeView === value ? 'text-primary underline' : ''}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content area */}
      <article
        className="space-y-4 mt-4"
        itemScope
        itemType="https://schema.org/Event"
      >
        <section className="text-gray-700">{renderSection()}</section>
      </article>
    </div>
  );
}
