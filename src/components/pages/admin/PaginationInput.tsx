import React, { useState, useEffect, KeyboardEvent } from 'react';

// Props for the pagination input component
interface PaginationInputProps {
  currentPage: number; // The currently active page
  totalPages: number; // The total number of pages available
  onPageChange: (page: number) => void; // Callback to notify parent of a page change
}

const PaginationInput: React.FC<PaginationInputProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Local state to control the value of the input field
  const [inputPage, setInputPage] = useState(currentPage);

  // Whenever the external currentPage changes, sync it back into local state
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  // Ensure the page number stays within [1, totalPages]
  const clamp = (page: number) => Math.min(Math.max(1, page), totalPages);

  // Handle Enter key: clamp and then fire the change callback
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onPageChange(clamp(inputPage));
    }
  };

  // On blur (focus leaves the input), also clamp & notify
  const handleBlur = () => {
    onPageChange(clamp(inputPage));
  };

  return (
    // Container for Prev button, input, and Next button
    <div className="flex items-center justify-center gap-3 pt-2">
      {/* Previous page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1} // Disable on first page
        className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

      {/* Input + total pages display */}
      <div className="flex items-center gap-2">
        {/* Page number input */}
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={e => setInputPage(Number(e.target.value))} // Update local state
          onKeyDown={handleKeyDown} // Submit on Enter
          onBlur={handleBlur} // Submit on blur
          className="w-12 text-center border border-gray-300 rounded-md py-1 outline-none"
        />
        {/* Display total pages */}
        <span className="text-sm text-gray-600">/ {totalPages}</span>
      </div>

      {/* Next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages} // Disable on last page
        className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationInput;
