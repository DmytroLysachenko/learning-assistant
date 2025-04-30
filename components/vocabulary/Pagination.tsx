"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  const getVisiblePages = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    const addRange = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    };

    if (currentPage <= 4) {
      addRange(1, 5);
      pages.push("ellipsis", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "ellipsis");
      addRange(totalPages - 4, totalPages);
    } else {
      pages.push(
        1,
        "ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis",
        totalPages
      );
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageButton = (page: number | "ellipsis", index: number) => {
    if (page === "ellipsis") {
      return (
        <span
          key={`ellipsis-${index}`}
          className="px-3 py-1"
        >
          ...
        </span>
      );
    }

    const isActive = currentPage === page;

    return (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`px-3 py-1 rounded-md ${
          isActive
            ? "bg-purple-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
        }`}
      >
        {page}
      </button>
    );
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {totalCount > 0 && (
        <div className="text-sm text-gray-500 order-2 sm:order-1">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </div>
      )}

      <div className="flex items-center space-x-1 order-1 sm:order-2">
        {!isFirstPage && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isFirstPage}
            className={`px-3 py-1 rounded-md ${
              isFirstPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Previous
          </button>
        )}

        {getVisiblePages().map((page, index) => renderPageButton(page, index))}

        {!isLastPage && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLastPage}
            className={`px-3 py-1 rounded-md ${
              isLastPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
