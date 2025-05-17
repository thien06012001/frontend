import React from 'react';

/////////////////////////
// Types & Interfaces //
/////////////////////////

/**
 * Represents a single statistic item with a label and numeric value.
 */
interface StatsItem {
  label: string;
  value: number;
}

/**
 * Props for StatsGrid: an array of StatsItem objects.
 */
interface StatsGridProps {
  items: StatsItem[];
}

/////////////////////////
// Component Definition //
/////////////////////////

/**
 * Renders a responsive grid of statistic cards.
 *
 * - On small screens: 1 column
 * - On medium screens (sm): 2 columns
 * - On large screens (lg): 4 columns
 *
 * Each card shows a label and a prominently styled numeric value.
 */
const StatsGrid: React.FC<StatsGridProps> = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {items.map(({ label, value }) => (
      // Each card needs a unique key; using the label here since it's unique per stat
      <div key={label} className="p-4 bg-gray-100 rounded-lg text-center">
        {/* Stat label */}
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        {/* Stat value with larger font for emphasis */}
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </div>
    ))}
  </div>
);

export default StatsGrid;
