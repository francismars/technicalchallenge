import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  prevPage: () => void;
  nextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, prevPage, nextPage }) => (
  <div className="flex justify-between items-center mt-4 gap-2">
    <button
      className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 font-medium shadow"
      onClick={prevPage}
      disabled={page === 1}
    >
      Previous
    </button>
    <span className="text-base font-semibold text-gray-700 dark:text-gray-200">{page} / {totalPages}</span>
    <button
      className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 font-medium shadow"
      onClick={nextPage}
      disabled={page === totalPages}
    >
      Next
    </button>
  </div>
);

export default Pagination; 