// src/components/pages/participate-event/Pagination.tsx

import { useState, useEffect, KeyboardEvent } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState<number>(currentPage);

  // Always show at least 1 page
  const effectiveTotalPages = Math.max(1, totalPages);

  // Clamp helper
  const clamp = (page: number) =>
    Math.min(Math.max(1, page), effectiveTotalPages);

  // Sync local input when parent page changes
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPageChange(clamp(inputPage));
    }
  };

  const handleInputBlur = () => {
    onPageChange(clamp(inputPage));
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={() => onPageChange(clamp(currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1 border border-primary cursor-pointer rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

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
