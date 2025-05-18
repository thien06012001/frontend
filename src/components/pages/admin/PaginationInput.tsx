// src/components/forms/PaginationInput.tsx

import React, { useState, useEffect, KeyboardEvent } from 'react';

/////////////////////////////
// Props Definition
/////////////////////////////

/**
 * PaginationInputProps
 *
 * @property currentPage   - The currently active page index (1-based).
 * @property totalPages    - Total number of available pages.
 * @property onPageChange  - Callback invoked with the new page number when it changes.
 */
interface PaginationInputProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/////////////////////////////
// Component Definition
/////////////////////////////

/**
 * PaginationInput
 *
 * Renders "Prev" and "Next" buttons along with a numeric input to navigate pages.
 * - Clamps the input within [1, totalPages].
 * - Syncs local input state when the external currentPage prop changes.
 * - Commits changes on Enter key press or when the input loses focus.
 */
const PaginationInput: React.FC<PaginationInputProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Local state for the controlled page number input
  const [inputPage, setInputPage] = useState(currentPage);

  // Sync local input when parent currentPage changes
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  /**
   * clamp
   *
   * Restricts a page number to the valid range [1 .. totalPages].
   *
   * @param page - Desired page number
   * @returns Clamped page number within bounds
   */
  const clamp = (page: number) => Math.min(Math.max(1, page), totalPages);

  /**
   * handleKeyDown
   *
   * If the Enter key is pressed, clamps the input value and triggers onPageChange.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPageChange(clamp(inputPage));
    }
  };

  /**
   * handleBlur
   *
   * When the input loses focus, clamps its value and notifies parent.
   */
  const handleBlur = () => {
    onPageChange(clamp(inputPage));
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      {/* Previous page button; disabled on first page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-primary rounded cursor-pointer disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

      {/* Numeric input with total pages indicator */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={e => setInputPage(Number(e.target.value))}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-12 text-center border border-gray-300 rounded-md py-1 outline-none"
        />
        <span className="text-sm text-gray-600">/ {totalPages}</span>
      </div>

      {/* Next page button; disabled on last page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationInput;
