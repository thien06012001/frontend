// src/components/pages/invitations/InvitationPagination.tsx

import { useState, useEffect, KeyboardEvent } from 'react';

interface InvitationPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function InvitationPagination({
  currentPage,
  totalPages,
  onPageChange,
}: InvitationPaginationProps) {
  // Local input state
  const [inputPage, setInputPage] = useState(currentPage);

  // Sync with parent currentPage
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  // Never allow fewer than 1 page
  const effectiveTotalPages = Math.max(1, totalPages);

  // Keep pages in [1, effectiveTotalPages]
  const clamp = (page: number) =>
    Math.min(Math.max(1, page), effectiveTotalPages);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPageChange(clamp(inputPage));
    }
  };

  const handleBlur = () => {
    onPageChange(clamp(inputPage));
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      {/* Prev */}
      <button
        onClick={() => onPageChange(clamp(currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1 border border-primary rounded cursor-pointer  disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

      {/* Page input / total */}
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

      {/* Next */}
      <button
        onClick={() => onPageChange(clamp(currentPage + 1))}
        disabled={currentPage >= effectiveTotalPages}
        className="px-3 py-1 border border-primary rounded cursor-pointer  disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Next
      </button>
    </div>
  );
}
