import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router';
import Info from '../components/pages/event-detail/Info';
import JoinedMembers from '../components/pages/event-detail/JoinedMembers';
import Requests from '../components/pages/event-detail/Requests';
import Invitations from '../components/pages/event-detail/Invitations';
import Reminder from '../components/pages/event-detail/Reminder';
import Discussion from '../components/pages/event-detail/Discussion';
import { Event } from '../types';
import { useFetch } from '../hooks/useFetch';
import useUser from '../hooks/redux/useUser';

type OrganizerView =
  | 'info'
  | 'members'
  | 'invitations'
  | 'reminders'
  | 'requests'
  | 'discussions';

function EventDetail() {
  // 1. Non-hook values first
  const { id } = useParams();

  const { data, isLoading } = useFetch(`/events/${id}`, {
    method: 'GET',
  });

  const event = data?.data as Event;

  const user = useUser();

  const currentUserId = user?.id || 'user-123'; // replace with real user ID
  const isOrganizer =
    (!!event && event.owner_id === currentUserId) || user?.role === 'admin';

  // 2. Hooks in fixed order
  const [searchParams, setSearchParams] = useSearchParams();

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

  const tabParam = (searchParams.get('tab') as OrganizerView) || 'info';
  const initialTab: OrganizerView = allowedTabs.includes(tabParam)
    ? tabParam
    : 'info';
  const [activeView, setActiveView] = useState<OrganizerView>(initialTab);

  useEffect(() => {
    if (!allowedTabs.includes(tabParam)) {
      setSearchParams({ tab: 'info' });
    }
  }, [allowedTabs, tabParam, setSearchParams]);

  if (!event && isLoading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  // 4. Handlers and render logic
  const handleTabChange = (tab: OrganizerView) => {
    setActiveView(tab);
    setSearchParams({ tab });
  };

  const navButtons: { label: string; value: OrganizerView }[] = isOrganizer
    ? [
        { label: 'Info', value: 'info' },
        { label: 'Joined Members', value: 'members' },
        { label: 'Requests', value: 'requests' },
        { label: 'Discussions', value: 'discussions' },
        { label: 'Invitations', value: 'invitations' },
        { label: 'Send Reminder', value: 'reminders' },
      ]
    : [
        { label: 'Info', value: 'info' },
        { label: 'Discussions', value: 'discussions' },
      ];

  const participants = event.participants || [];

  const renderSection = () => {
    switch (activeView) {
      case 'info':
        return <Info event={event} isOrganizer={isOrganizer} />;
      case 'discussions':
        return <Discussion posts={event.posts} isOrganizer={isOrganizer} />;
      case 'members':
        return isOrganizer ? (
          <JoinedMembers participants={participants} />
        ) : null;
      case 'requests':
        return isOrganizer ? <Requests /> : null;
      case 'invitations':
        return isOrganizer ? <Invitations /> : null;
      case 'reminders':
        return isOrganizer ? (
          <Reminder eventStartDate={event.start_time} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="p-5 mt-5 border border-gray-200 shadow-md rounded-md">
      <nav aria-label="Breadcrumb">
        <Link to="/" className="text-primary underline">
          &larr; Back to Homepage
        </Link>
      </nav>

      {/* Responsive Navigation */}
      <div className="mt-4">
        {/* Mobile: Select dropdown */}
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

        {/* Desktop: Tab buttons */}
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

      {/* Content */}
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

export default EventDetail;
