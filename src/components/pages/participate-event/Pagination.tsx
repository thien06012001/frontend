// src/components/pages/participate-event/Pagination.tsx

import { useState, useEffect, KeyboardEvent } from 'react';

/////////////////////
// Prop Definitions
/////////////////////
/**
 * Props for the Pagination component.
 *
 * @property currentPage   - The currently active page number.
 * @property totalPages    - Total number of pages available.
 * @property onPageChange  - Callback invoked with the new page number.
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/////////////////////
// Component
/////////////////////
/**
 * Pagination
 *
 * Renders "Prev" and "Next" buttons plus a numeric input to navigate pages.
 * - Ensures the page number is always between 1 and totalPages.
 * - Syncs internal input state with external currentPage prop.
 * - Commits changes on Enter key or input blur.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Local state to control the page number input field
  const [inputPage, setInputPage] = useState<number>(currentPage);

  // Ensure there's always at least one page
  const effectiveTotalPages = Math.max(1, totalPages);

  /**
   * clamp
   *
   * Restricts a page number within the valid range [1, effectiveTotalPages].
   *
   * @param page - Desired page number
   * @returns     - Clamped page number
   */
  const clamp = (page: number) =>
    Math.min(Math.max(1, page), effectiveTotalPages);

  // Keep the input field in sync when currentPage prop changes
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  /**
   * handleInputKeyDown
   *
   * Listens for the Enter key on the input field to commit a page change.
   *
   * @param e - Keyboard event
   */
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPageChange(clamp(inputPage));
    }
  };

  /**
   * handleInputBlur
   *
   * Commits a page change when the input field loses focus.
   */
  const handleInputBlur = () => {
    onPageChange(clamp(inputPage));
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      {/* Previous page button; disabled on first page */}
      <button
        onClick={() => onPageChange(clamp(currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

      {/* Page number input and total pages display */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={effectiveTotalPages}
          value={inputPage}
          onChange={e => setInputPage(Number(e.target.value))}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          className="w-12 text-center border border-gray-300 rounded-md py-1 outline-none"
        />
        <span className="text-sm text-gray-600">/ {effectiveTotalPages}</span>
      </div>

      {/* Next page button; disabled on last page */}
      <button
        onClick={() => onPageChange(clamp(currentPage + 1))}
        disabled={currentPage >= effectiveTotalPages}
        className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Next
      </button>
    </div>
  );
}
