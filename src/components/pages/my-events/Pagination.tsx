// src/components/pages/my-events/Pagination.tsx

/**
 * Props for pagination controls on the My Events page
 * @property currentPage - Index of the currently active page (1-based)
 * @property totalPages - Total number of available pages
 * @property onPageChange - Callback function to navigate to a selected page
 */
interface MyEventPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination component renders "Prev", numbered page buttons, and "Next" controls.
 * Highlights the active page and disables Prev/Next at the bounds.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: MyEventPaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 pt-2">
      {/* Prev button: disabled when on the first page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>

      {/* Numeric page buttons: one button per page */}
      {[...Array(totalPages)].map((_, idx) => {
        const pageNum = idx + 1;
        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 border border-primary rounded hover:bg-primary hover:text-white ${
              isActive ? 'bg-primary text-white' : ''
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next button: disabled when on the last page */}
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
