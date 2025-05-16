// components/pages/invitations/InvitationPagination.tsx

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
  const [inputPage, setInputPage] = useState(currentPage);

  // keep the input in sync if parent currentPage changes
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const clamp = (page: number) => Math.min(Math.max(1, page), totalPages);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPageChange(clamp(inputPage));
    }
  };

  const handleBlur = () => {
    onPageChange(clamp(inputPage));
  };

  return (
    <div className="flex  items-center justify-center gap-3 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
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
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-12 text-center border border-gray-300 rounded-md py-1 outline-none"
        />
        <span className="text-sm text-gray-600">/ {totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Next
      </button>
    </div>
  );
}
