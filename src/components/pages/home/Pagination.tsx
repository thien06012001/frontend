// src/components/home/Pagination.tsx

/**
 * Props for the Pagination component
 * @property currentPage - The currently active page number
 * @property totalPages - Total number of available pages
 * @property inputPage - Controlled input value for manual page entry
 * @property onInputChange - Callback to update inputPage state on user input
 * @property onPageChange - Callback to navigate to a new page when triggered
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  inputPage: number;
  onInputChange: (page: number) => void;
  onPageChange: (page: number) => void;
}

/**
 * Renders pagination controls with "Prev" and "Next" buttons,
 * plus an input field for direct page entry.
 * Disables navigation buttons at the bounds and
 * validates manual entry via Enter key or blur event.
 */
export default function Pagination({
  currentPage,
  totalPages,
  inputPage,
  onInputChange,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      {/* Previous page button: disabled on first page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-primary hover:bg-primary hover:text-white rounded disabled:opacity-50"
      >
        Prev
      </button>

      {/* Page input: allows typing a page number directly */}
      <div className="flex items-center space-x-1">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={e => onInputChange(Number(e.target.value))}
          onKeyDown={e => {
            // Trigger page change when user presses Enter
            if (e.key === 'Enter') onPageChange(inputPage);
          }}
          onBlur={() => onPageChange(inputPage)} // Validate on blur
          className="w-12 text-center border border-gray-300 rounded-md py-1"
        />
        {/* Display total page count */}
        <span className="text-sm text-gray-600">/ {totalPages}</span>
      </div>

      {/* Next page button: disabled on last page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-primary hover:bg-primary hover:text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
