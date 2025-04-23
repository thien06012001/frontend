import Button from '../../ui/Button';

const eventData = [
  {
    title: 'Eid al-Fitr 2024 🕌',
    date: 'April 10, 2024',
    timeRange: '7:00 AM - 12:00 AM',
    type: 'Private',
    location: 'Blue Mosque, Istanbul, Turkey',
    attendees: 70,
  },
  {
    title: 'Coachella Valley Music & Arts Festival 2024 🎶',
    date: 'June 12, 2024',
    timeRange: '6:00 PM - 10:00 PM',
    type: 'Public',
    location: 'Empire Polo Club, Indio, USA',
    attendees: 20,
  },
];

const upcomingEvents = [
  {
    title: 'Private Event 1',
    date: 'September 12, 2024',
    attendees: '45 / 120',
    type: 'Private',
  },
  {
    title: 'Public Event 1',
    date: 'September 25, 2024',
    attendees: '90 / 150',
    type: 'Public',
  },
  {
    title: 'Private Event 2',
    date: 'September 27, 2024',
    attendees: '25 / 120',
    type: 'Private',
  },
  {
    title: 'Public Event 2',
    date: 'September 29, 2024',
    attendees: '45 / 100',
    type: 'Public',
  },
];

function Tracking() {
  return (
    <section className="p-5 mt-5 bg-white space-y-5 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="font-semibold text-3xl">Event Tracking</h2>

      {/* Current Events */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl">Current events</h3>
          <span className="text-2xl font-semibold cursor-pointer">...</span>
        </div>
        <div className="flex flex-col space-y-3">
          {eventData.map((event, index) => (
            <div
              key={index}
              className="flex-1 flex justify-between items-center border border-gray-200 rounded-md p-5"
            >
              <div className="space-y-1 flex-1">
                <p>{event.title}</p>
                <p className="text-xs text-gray-400">
                  {event.date} – {event.timeRange}
                </p>
                <div className="flex justify-start items-center space-x-3 mt-5 w-full">
                  <div className="flex text-xs space-x-1">
                    <img src="icons/event-star.png" alt="event type" />
                    <span>{event.type}</span>
                  </div>
                  <div className="flex text-xs space-x-1">
                    <img src="icons/global.png" alt="Address" />
                    <p>{event.location}</p>
                  </div>
                  <div className="flex text-xs space-x-1">
                    <img
                      src="icons/people.png"
                      alt="people"
                      className="size-4"
                    />
                    <span>{event.attendees}</span>
                  </div>
                </div>
              </div>
              <Button className="h-fit">View Details</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl">Upcoming Events</h3>
          <span className="text-2xl font-semibold cursor-pointer">...</span>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center border space-y-3 border-gray-200 rounded-md p-5 w-[220px]"
            >
              <p className="font-semibold text-lg">{event.title}</p>
              <div className="flex items-center space-x-1">
                <img src="icons/calendar.png" alt="Calendar" />
                <p>{event.date}</p>
              </div>
              <div className="flex items-center">
                <img src="icons/people.png" alt="People" />
                <p className="border-r px-2">{event.attendees}</p>
                <img src="icons/mail.png" alt="Mail" className="ml-2" />
              </div>
              <Button className="p-1">View Detail</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Tracking;
