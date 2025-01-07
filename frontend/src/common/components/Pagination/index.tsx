import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Function to generate page numbers dynamically
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <footer className="p-5">
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className="text-black font-semibold mr-4">
            Showing {currentPage} of {totalPages} entries
          </span>
        </div>
        <div className="flex items-center">
          {/* Previous Page Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="bg-white text-black font-semibold px-4 py-2 rounded-lg transition duration-300 mr-2"
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg transition duration-300 mr-2 ${
                page === currentPage
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-black font-medium'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Page Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="bg-white text-black font-semibold px-4 py-2 rounded-lg transition duration-300 ml-2"
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Pagination;
