// src/hooks/context/ToastContext.tsx

import React, { createContext, useContext, useState } from 'react';

/////////////////////////////
// Type Definitions
/////////////////////////////

/** Possible types of toast notifications. */
type ToastType = 'info' | 'success' | 'error';

/**
 * Represents a single toast notification.
 *
 * @property id         - Unique identifier for the toast.
 * @property message    - Text message displayed in the toast.
 * @property type       - Visual style of the toast (info, success, error).
 * @property isVisible  - Controls fade-in/fade-out animation visibility.
 */
interface Toast {
  id: number;
  message: string;
  type: ToastType;
  isVisible: boolean;
}

/**
 * Context value exposed by ToastProvider.
 *
 * @property toasts    - Array of active toasts.
 * @property showToast - Function to enqueue a new toast.
 */
interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
}

/////////////////////////////
// Context Creation
/////////////////////////////

/** React context for toast notifications; initially undefined. */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/////////////////////////////
// Provider Component
/////////////////////////////

/**
 * ToastProvider
 *
 * Wrap your application (or part of it) in this provider to enable
 * toast notifications via the `useToast` hook.
 *
 * Manages:
 * - Enqueuing toasts with unique IDs.
 * - Automatic fade-out after 3 seconds.
 * - Removal from state after fade-out animation completes.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State: list of active toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Counter for generating unique toast IDs
  let toastIdCounter = 0;

  /**
   * showToast
   *
   * Adds a new toast to the queue, schedules its fade-out and removal.
   *
   * @param message - The message text to display.
   * @param type    - The variant of the toast (info, success, error).
   */
  const showToast = (message: string, type: ToastType = 'info') => {
    // Generate a new ID for this toast
    const id = toastIdCounter++;
    // Append the new toast to state
    setToasts(prev => [...prev, { id, message, type, isVisible: true }]);

    // After 3 seconds, start fade-out animation
    setTimeout(() => {
      setToasts(prev =>
        prev.map(toast =>
          toast.id === id ? { ...toast, isVisible: false } : toast,
        ),
      );

      // After fade-out (300ms), remove the toast from state
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 300);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

/////////////////////////////
// Custom Hook
/////////////////////////////

/**
 * useToast
 *
 * Hook to access toast context. Throws an error if used outside
 * of the ToastProvider.
 *
 * @returns Context object with `toasts` array and `showToast` function.
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
