import { useState } from 'react';
import Button from '../../ui/Button';
import { useToast } from '../../../hooks/context/ToastContext';

const data = {
  events: [
    {
      id: 1,
      title: 'Eid al-Fitr 2024 🕌',
      date: 'April 10, 2024',
      timeRange: '7:00 AM - 12:00 AM',
      type: 'Private',
      location: 'Blue Mosque, Istanbul, Turkey',
      attendees: 70,
    },
    {
      id: 2,
      title: 'Coachella Valley Music & Arts Festival 2024 🎶',
      date: 'June 12, 2024',
      timeRange: '6:00 PM - 10:00 PM',
      type: 'Public',
      location: 'Empire Polo Club, Indio, USA',
      attendees: 20,
    },
    {
      id: 3,
      title: 'Tokyo 2024 Cherry Blossom Festival 🌸',
      date: 'April 15, 2024',
      timeRange: '9:00 AM - 6:00 PM',
      type: 'Public',
      location: 'Shinjuku Gyoen, Tokyo, Japan',
      attendees: 150,
    },
    {
      id: 4,
      title: 'Comic-Con International 2024 🎭',
      date: 'July 23, 2024',
      timeRange: '10:00 AM - 8:00 PM',
      type: 'Public',
      location: 'San Diego Convention Center, San Diego, USA',
      attendees: 250,
    },
  ],
  page: 1,
  totalPage: 10,
};
interface RequestStatus {
  [eventId: number]: 'none' | 'pending' | 'approved';
}

function Events() {
  const [currentPage, setCurrentPage] = useState(data.page);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>({});
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
  const { showToast } = useToast(); // Use the showToast function from context

  const totalPages = data.totalPage;

  const handleRequestAction = async (eventId: number) => {
    setLoadingEventId(eventId);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentStatus = requestStatus[eventId];

    if (currentStatus === 'pending' || currentStatus === 'approved') {
      setRequestStatus(prev => ({
        ...prev,
        [eventId]: 'none',
      }));
      showToast('Request cancelled!', 'info');
    } else {
      setRequestStatus(prev => ({
        ...prev,
        [eventId]: 'pending',
      }));
      showToast('Request sent! Waiting for approval.', 'info');

      setTimeout(() => {
        setRequestStatus(prev => ({
          ...prev,
          [eventId]: 'approved',
        }));
        showToast('Your request was approved!', 'success');
      }, 2000);
    }

    setLoadingEventId(null);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <section className="relative p-5 flex-1 flex flex-col justify-around mt-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h1 className="font-semibold text-3xl mb-5">Homepage</h1>

      <div className="flex flex-col space-y-3">
        {data.events.map(event => {
          const status = requestStatus[event.id] || 'none';
          const isLoading = loadingEventId === event.id;

          let buttonLabel = 'Request';
          let buttonColor = 'bg-blue-500 hover:bg-blue-600';

          if (status === 'pending') {
            buttonLabel = 'Cancel';
            buttonColor = 'bg-red-500 hover:bg-red-600';
          }
          if (status === 'approved') {
            buttonLabel = 'Leave';
            buttonColor = 'bg-green-500 hover:bg-green-600';
          }

          return (
            <div
              key={event.id}
              className="flex-1 flex justify-between items-center border border-gray-200 rounded-md p-3"
            >
              <div className="space-y-1 flex-1">
                <p>{event.title}</p>
                <p className="text-xs text-gray-400">
                  {event.date} – {event.timeRange}
                </p>
                <div className="flex justify-start items-center space-x-3 mt-3 w-full">
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

              <button
                className={`text-white text-sm py-2 px-4 rounded-md transition-all ${buttonColor} disabled:bg-gray-300`}
                onClick={() => handleRequestAction(event.id)}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : buttonLabel}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-5 mt-6">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {/* Toast Container */}
    </section>
  );
}

export default Events;
