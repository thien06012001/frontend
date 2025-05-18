// src/components/pages/my-events/Pagination.tsx
import { useState, useEffect, KeyboardEvent } from 'react';

interface MyEventPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: MyEventPaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage);

  // keep the input in sync if parent currentPage changes
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  // never show “/ 0”
  const effectiveTotalPages = Math.max(1, totalPages);

  // clamp page to [1..effectiveTotalPages]
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
    <div className="flex justify-center items-center gap-2 pt-2">
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
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-12 text-center border border-gray-300 rounded-md py-1 outline-none"
        />
        <span className="text-sm text-gray-600">/ {effectiveTotalPages}</span>
      </div>

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
