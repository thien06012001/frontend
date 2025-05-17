// src/components/pages/participate-event/Pagination.tsx

import { useState, useEffect, KeyboardEvent } from 'react';

/**
 * Props for the pagination component in the ParticipateEvents page.
 */
interface PaginationProps {
  /** The currently active page (1-based index) */
  currentPage: number;
  /** Total number of available pages */
  totalPages: number;
  /**
   * Callback invoked when the user selects a different page.
   * @param page The new page number to navigate to
   */
  onPageChange: (page: number) => void;
}

/**
 * Renders pagination controls with "Prev" and "Next" buttons,
 * plus an input for direct page entry.
 * Synchronizes the local input field with the external currentPage,
 * and ensures values remain within valid bounds.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Local state for the numeric input field
  const [inputPage, setInputPage] = useState<number>(currentPage);

  /**
   * Synchronize the input field whenever currentPage prop changes
   */
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  /**
   * Handle Enter key press in the page input:
   * clamp to [1, totalPages], then trigger page change
   */
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const next = Math.max(1, Math.min(totalPages, inputPage));
      onPageChange(next);
    }
  };

  /**
   * Handle blur event on the input field:
   * clamp and trigger page change to keep URL/state in sync
   */
  const handleInputBlur = () => {
    const next = Math.max(1, Math.min(totalPages, inputPage));
    onPageChange(next);
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      {/* Button to go to the previous page; disabled at first page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

      {/* Numeric input and total page indicator */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={e => setInputPage(Number(e.target.value))}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          className="w-12 text-center border border-gray-300 rounded-md py-1 outline-none"
        />
        <span className="text-sm text-gray-600">/ {totalPages}</span>
      </div>

      {/* Button to go to the next page; disabled on last page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Next
      </button>
    </div>
  );
}
