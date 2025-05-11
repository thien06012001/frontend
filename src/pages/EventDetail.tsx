import { useParams, Link } from 'react-router';
import { useState } from 'react';
import Button from '../components/ui/Button';
import JoinedMembers from '../components/pages/event-detail/JoinedMembers';
import Requests from '../components/pages/event-detail/Requests';
import Invitations from '../components/pages/event-detail/Invitations';
import Reminder from '../components/pages/event-detail/Reminder';
import Discussion from '../components/pages/event-detail/Discussion';

const mockEvents = [
  {
    id: '1',
    name: 'Sharjah Light Festival 🖼️',
    date: '2024-01-12',
    timeRange: '18:00 - 22:00',
    type: 'Public',
    location: 'Al Noor Mosque, Sharjah',
    description: 'A celebration of light and culture.',
    slot: { participated: 80, capacity: 120 },
    organizerId: 'user-123',
  },
];

type OrganizerView =
  | 'info'
  | 'members'
  | 'invitations'
  | 'reminders'
  | 'requests'
  | 'discussions';

function EventDetail() {
  const { id } = useParams();
  const event = mockEvents.find(e => e.id === id);
  const currentUserId = 'user-123'; // Replace with session user id
  const [activeView, setActiveView] = useState<OrganizerView>('info');

  if (!event)
    return (
      <main className="p-5">
        <h1>Event not found</h1>
      </main>
    );

  const isOrganizer = event.organizerId === currentUserId;

  const renderOrganizerSection = () => {
    switch (activeView) {
      case 'members':
        return <JoinedMembers />;
      case 'invitations':
        return <Invitations />;
      case 'reminders':
        return <Reminder />;
      case 'requests':
        return <Requests />;
      case 'discussions':
        return <Discussion />;
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

      {isOrganizer && (
        <nav className="mt-4 flex gap-3 text-sm font-medium border border-primary bg-primary/5 p-3 rounded-md flex-wrap">
          <button
            onClick={() => setActiveView('info')}
            className={activeView === 'info' ? 'text-primary underline' : ''}
          >
            Info
          </button>
          <button
            onClick={() => setActiveView('members')}
            className={activeView === 'members' ? 'text-primary underline' : ''}
          >
            Joined Members
          </button>
          <button
            onClick={() => setActiveView('requests')}
            className={
              activeView === 'requests' ? 'text-primary underline' : ''
            }
          >
            Requests
          </button>
          <button
            onClick={() => setActiveView('discussions')}
            className={
              activeView === 'discussions' ? 'text-primary underline' : ''
            }
          >
            Discussions
          </button>
          <button
            onClick={() => setActiveView('invitations')}
            className={
              activeView === 'invitations' ? 'text-primary underline' : ''
            }
          >
            Invitations
          </button>
          <button
            onClick={() => setActiveView('reminders')}
            className={
              activeView === 'reminders' ? 'text-primary underline' : ''
            }
          >
            Send Reminder
          </button>
        </nav>
      )}

      <article
        className="space-y-4 mt-4"
        itemScope
        itemType="https://schema.org/Event"
      >
        {activeView === 'info' && (
          <>
            <header>
              <h1 className="text-3xl font-semibold" itemProp="name">
                {event.name}
              </h1>
            </header>

            <section>
              <p itemProp="description" className="text-gray-700">
                {event.description}
              </p>
            </section>

            <section className="space-y-1">
              <div>
                <strong>Date:</strong>{' '}
                <time itemProp="startDate" dateTime={event.date}>
                  {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div>
                <strong>Time:</strong> <span>{event.timeRange}</span>
              </div>
              <div>
                <strong>Type:</strong> <span>{event.type}</span>
              </div>
              <div>
                <strong>Slot:</strong>{' '}
                <span>
                  {event.slot.participated} / {event.slot.capacity}
                </span>
              </div>
              <address itemProp="location" className="not-italic">
                <strong>Location:</strong> {event.location}
              </address>
            </section>

            {!isOrganizer && (
              <footer>
                <Button>Request to Join</Button>
              </footer>
            )}
          </>
        )}

        {isOrganizer && activeView !== 'info' && (
          <section className="text-gray-700">
            {renderOrganizerSection()}
          </section>
        )}
      </article>
    </div>
  );
}

export default EventDetail;
