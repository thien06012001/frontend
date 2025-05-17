// src/components/home/Events.tsx

import { formatDate } from '../../../libs/utils';
import { Event } from '../../../types';

/**
 * Props for the Events component
 * @param events - Array of Event objects to display
 * @param userId - ID of the current user for action permissions
 * @param onAction - Callback when user invokes request/cancel/leave
 */
interface EventsProps {
  events: Event[];
  userId: string;
  onAction: (eventId: string, action: 'request' | 'cancel' | 'leave') => void;
}

/**
 * Renders a list of event cards with action buttons based on user state
 * - If user is the owner, no action button is shown
 * - If user has a pending request, shows "Cancel"
 * - If user has joined, shows "Leave"
 * - Otherwise, shows "Request"
 */
export default function Events({ events, userId, onAction }: EventsProps) {
  return (
    <div className="space-y-4">
      {events.map(ev => {
        // Determine if user has a pending join request
        const isPending = ev.requests.some(
          r => r.user_id === userId && r.status === 'pending',
        );
        // Determine if user is already a participant
        const isJoined = ev.participants.some(p => p.id === userId);
        // Determine if user is the event owner
        const isOwner = ev.owner_id === userId;

        // Default button state
        let label = 'Request';
        let color = 'bg-blue-500 hover:bg-blue-600';
        // Adjust label and styling based on user's relationship to event
        if (isPending) {
          label = 'Cancel';
          color = 'bg-red-500 hover:bg-red-600';
        } else if (isJoined) {
          label = 'Leave';
          color = 'bg-green-500 hover:bg-green-600';
        }

        return (
          <div
            key={ev.id}
            className="flex flex-col md:flex-row md:justify-between md:items-center \
              border border-gray-200 rounded-md p-4 space-y-4 md:space-y-0"
          >
            {/* Event details section */}
            <div className="flex-1 space-y-2">
              <p className="block text-lg font-medium">{ev.name}</p>
              <p className="text-sm text-gray-500">
                {/* Format start and end times for readability */}
                {formatDate(ev.start_time)} – {formatDate(ev.end_time)}
              </p>
              <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4">
                {/* Location icon and label */}
                <span className="flex items-center space-x-1">
                  <img
                    src="/icons/global.png"
                    alt="Location"
                    className="w-4 h-4"
                  />
                  <span>{ev.location}</span>
                </span>
                {/* Participant count icon and label */}
                <span className="flex items-center space-x-1">
                  <img
                    src="/icons/people.png"
                    alt="Attendees"
                    className="w-4 h-4"
                  />
                  <span>{ev.participants.length}</span>
                </span>
              </div>
            </div>

            {/* Action button: not shown for the owner */}
            {!isOwner && (
              <button
                onClick={() =>
                  onAction(
                    ev.id,
                    // Choose action based on user state
                    isJoined ? 'leave' : isPending ? 'cancel' : 'request',
                  )
                }
                className={`w-full md:w-auto text-white ${color} \
                  py-2 px-4 rounded-md text-sm transition`}
              >
                {label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
