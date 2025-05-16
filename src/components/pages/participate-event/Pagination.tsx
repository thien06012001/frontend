// components/Pagination.tsx

import { useState, useEffect, KeyboardEvent } from 'react';

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

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage);

  // Keep local input in sync with external currentPage
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const next = Math.max(1, Math.min(totalPages, inputPage));
      onPageChange(next);
    }
  };

  const handleInputBlur = () => {
    const next = Math.max(1, Math.min(totalPages, inputPage));
    onPageChange(next);
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

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
