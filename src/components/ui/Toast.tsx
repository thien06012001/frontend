// src/ui/components/ui/Toast.tsx

import React from 'react';

//////////////////////
// Type Definitions //
//////////////////////

/** Allowed types for toast variants. */
type ToastType = 'info' | 'success' | 'error';

/**
 * Props for the Toast component.
 *
 * @property message    - Text to display inside the toast.
 * @property type       - Visual variant, one of 'info', 'success', or 'error'.
 * @property isVisible  - Controls whether the toast is entering or leaving.
 */
interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

///////////////////////
// Icon Configuration //
///////////////////////

/** Mapping of toast types to their respective emoji icons. */
const toastIcons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

///////////////////////
// Component Definition //
///////////////////////

/**
 * Toast
 *
 * Displays a transient notification banner with:
 * - An icon based on the toast variant.
 * - A message string.
 * - Entrance and exit animations controlled by `isVisible`.
 *
 * @param props - ToastProps
 */
const Toast: React.FC<ToastProps> = ({ message, type, isVisible }) => {
  // Determine background color class based on toast type
  const bgColorClass =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500';

  // Determine animation class based on visibility
  const animationClass = isVisible ? 'animate-slideIn' : 'animate-collapse';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        flex items-center space-x-2
        text-white text-sm py-2 px-4
        rounded-md shadow-lg
        transition-all duration-300
        ${animationClass}
        ${bgColorClass}
      `}
    >
      {/* Icon for the toast type */}
      <span aria-hidden="true" className="text-lg">
        {toastIcons[type]}
      </span>

      {/* Message text */}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
