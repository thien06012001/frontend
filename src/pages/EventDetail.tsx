import { useParams, Link } from 'react-router';
import Button from '../components/ui/Button';

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
  },
  // Add more mock events as needed
];

function EventDetail() {
  const { id } = useParams();
  const event = mockEvents.find(e => e.id === id);

  if (!event)
    return (
      <main className="p-5">
        <h1>Event not found</h1>
      </main>
    );

  return (
    <div className="p-5 mt-5 border border-gray-200 shadow-md rounded-md">
      <nav aria-label="Breadcrumb">
        <Link to="/" className="text-primary underline">
          &larr; Back to Homepage
        </Link>
      </nav>

      <article
        className="space-y-4 mt-4"
        itemScope
        itemType="https://schema.org/Event"
      >
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

        <footer>
          <Button>Request to Join</Button>
        </footer>
      </article>
    </div>
  );
}

export default EventDetail;
