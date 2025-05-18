// src/components/pages/my-events/Pagination.tsx

import { useState, useEffect, KeyboardEvent } from 'react';

/////////////////////////////
// Prop Definitions
/////////////////////////////
/**
 * Props for the My Events pagination component.
 *
 * @property currentPage   - The currently active page (1-based index).
 * @property totalPages    - The total number of pages available.
 * @property onPageChange  - Callback invoked with the new page number when it changes.
 */
interface MyEventPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/////////////////////////////
// Component Definition
/////////////////////////////
/**
 * Pagination
 *
 * Renders "Prev" and "Next" buttons with a numeric input for direct page navigation.
 * - Ensures the page number is clamped between 1 and the effective total pages.
 * - Syncs the local input field when the parent `currentPage` prop updates.
 * - Commits changes when the user presses Enter or blurs the input field.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: MyEventPaginationProps) {
  // Local state for the controlled input field
  const [inputPage, setInputPage] = useState(currentPage);

  // Synchronize the input value whenever the parent currentPage changes
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  // Prevent displaying "/ 0" by ensuring at least one page exists
  const effectiveTotalPages = Math.max(1, totalPages);

  /**
   * clamp
   *
   * Restricts the page number to the valid range [1 .. effectiveTotalPages].
   *
   * @param page - Desired page number
   * @returns     - Clamped page number within valid bounds
   */
  const clamp = (page: number) =>
    Math.min(Math.max(1, page), effectiveTotalPages);

  /**
   * handleKeyDown
   *
   * Listens for the Enter key in the input field to commit a page change.
   *
   * @param e - Keyboard event on the input
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPageChange(clamp(inputPage));
    }
  };

  /**
   * handleBlur
   *
   * Commits the page change when the input field loses focus.
   */
  const handleBlur = () => {
    onPageChange(clamp(inputPage));
  };

  return (
    <div className="flex justify-center items-center gap-2 pt-2">
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(clamp(currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

      {/* Page number input with total pages display */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={effectiveTotalPages}
          value={inputPage}
          onChange={e => setInputPage(Number(e.target.value))}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-12 text-center border border-gray-300 rounded-md py-1 outline-none"
        />
        <span className="text-sm text-gray-600">/ {effectiveTotalPages}</span>
      </div>

      {/* Next page button */}
      <button
        onClick={() => onPageChange(clamp(currentPage + 1))}
        disabled={currentPage >= effectiveTotalPages}
        className="px-3 py-1 border border-primary rounded cursor-pointer disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Next
      </button>
    </div>
  );
}
