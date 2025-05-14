// components/Pagination.tsx
// ------------------------------------------
// Pagination Component
// - Renders page navigation controls (Prev, numbered pages, Next).
// - Disables Prev/Next when on first/last page.
// - Highlights the active page number.
// ------------------------------------------

import React from 'react';

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
 * Pagination
 *
 * Controlled component that displays:
 * - A "Prev" button to go to the previous page
 * - A button for each page number
 * - A "Next" button to go to the next page
 *
 * Buttons are disabled when navigation would exceed the page bounds.
 */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 pt-2">
      {/*
        Prev Button:
        - Decrements the current page by 1
        - Disabled when already on page 1
      */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-primary hover:bg-primary hover:text-white cursor-pointer rounded disabled:opacity-50"
      >
        Prev
      </button>

      {/*
        Page Number Buttons:
        - Renders a button for each page from 1 to totalPages
        - Highlights the active page
        - Calls onPageChange with the selected page number
      */}
      {[...Array(totalPages)].map((_, idx) => {
        const pageNum = idx + 1;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 border border-primary rounded cursor-pointer hover:bg-primary hover:text-white ${
              isActive ? 'bg-primary text-white' : ''
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      {/*
        Next Button:
        - Increments the current page by 1
        - Disabled when already on the last page
      */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-primary hover:bg-primary hover:text-white cursor-pointer rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
