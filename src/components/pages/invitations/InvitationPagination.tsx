// src/components/pages/invitations/InvitationPagination.tsx

import { useState, useEffect, KeyboardEvent } from 'react';

/////////////////////////////
// Prop Definitions
/////////////////////////////

/**
 * InvitationPaginationProps
 *
 * @property currentPage   - Currently active page number (1-based).
 * @property totalPages    - Total number of pages available.
 * @property onPageChange  - Callback invoked with the new page number.
 */
interface InvitationPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/////////////////////////////
// Component Definition
/////////////////////////////

/**
 * InvitationPagination
 *
 * Renders "Prev"/"Next" buttons and a numeric input to navigate invitation pages.
 * - Ensures page stays within [1 .. effectiveTotalPages].
 * - Syncs local input state when parent `currentPage` changes.
 * - Commits changes on Enter key or when input loses focus.
 */
export default function InvitationPagination({
  currentPage,
  totalPages,
  onPageChange,
}: InvitationPaginationProps) {
  // Local state for the controlled page number input
  const [inputPage, setInputPage] = useState(currentPage);

  // Keep inputPage in sync with the parent currentPage prop
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  // Guarantee at least one page exists to avoid showing "/ 0"
  const effectiveTotalPages = Math.max(1, totalPages);

  /**
   * clamp
   *
   * Restricts the given page to the valid range [1 .. effectiveTotalPages].
   *
   * @param page - Desired page number
   * @returns     - Clamped page number
   */
  const clamp = (page: number) =>
    Math.min(Math.max(1, page), effectiveTotalPages);

  /**
   * handleKeyDown
   *
   * Commits the page change when the user presses Enter in the input.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPageChange(clamp(inputPage));
    }
  };

  /**
   * handleBlur
   *
   * Commits the page change when the input loses focus.
   */
  const handleBlur = () => {
    onPageChange(clamp(inputPage));
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      {/* Prev button: moves to the previous page, disabled on first page */}
      <button
        onClick={() => onPageChange(clamp(currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1 border border-primary rounded cursor-pointer disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

      {/* Page input with total pages indicator */}
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

      {/* Next button: moves to the next page, disabled on last page */}
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
