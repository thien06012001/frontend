import React from 'react';

/////////////////////////
// Types & Interfaces //
/////////////////////////

/**
 * Represents the data for one event category summary.
 * - `title`: label for the category (e.g. "Past Events")
 * - `count`: number of events in that category
 */
interface EventSummary {
  title: string;
  count: number;
}

/**
 * Props for EventsSummary: an array of EventSummary objects.
 */
interface EventsSummaryProps {
  summaries: EventSummary[];
}

/////////////////////////
// Component Definition //
/////////////////////////

/**
 * Renders a responsive grid of event summary cards.
 *
 * Layout:
 * - 1 column on smallest screens
 * - 3 columns on small (sm) and up
 *
 * Each card displays:
 * - A category title
 * - The count of events in that category, with emphasis
 */
const EventsSummary: React.FC<EventsSummaryProps> = ({ summaries }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    {summaries.map(({ title, count }) => (
      // Use title as key (unique per category)
      <div key={title} className="p-4 bg-gray-100 rounded-lg text-center">
        {/* Category title */}
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {/* Event count, styled prominently */}
        <p className="mt-2 text-2xl font-bold">{count}</p>
      </div>
    ))}
  </div>
);

export default EventsSummary;
