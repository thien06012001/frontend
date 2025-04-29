interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 pt-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-primary hover:bg-primary hover:text-white cursor-pointer rounded disabled:opacity-50"
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, idx) => {
        const pageNum = idx + 1;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 border hover:bg-primary hover:text-white border-primary cursor-pointer rounded ${
              pageNum === currentPage ? 'bg-primary text-white' : ''
            }`}
          >
            {pageNum}
          </button>
        );
      })}
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
