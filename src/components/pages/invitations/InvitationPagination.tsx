interface InvitationPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function InvitationPagination({
  currentPage,
  totalPages,
  onPageChange,
}: InvitationPaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-primary rounded disabled:opacity-50 hover:bg-primary hover:text-white"
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, idx) => {
        const pageNum = idx + 1;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 border border-primary rounded hover:bg-primary hover:text-white ${
              currentPage === pageNum ? 'bg-primary text-white' : ''
            }`}
          >
            {pageNum}
          </button>
        );
      })}
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

export default InvitationPagination;
