import React from 'react';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';
import './Pagination.css'; // We'll create this next

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    if (totalPages <= 7) {
      // If total pages is 7 or less, show all pages
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <nav aria-label="Pet listing pagination" className="d-flex justify-content-center my-4">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link custom-page-link" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft className="pagination-icon" />
          </button>
        </li>
        
        {getPageNumbers().map((page, index) => (
          <li 
            key={index} 
            className={`page-item ${typeof page === 'number' && page === currentPage ? 'active' : ''}`}
          >
            <button
              className="page-link custom-page-link"
              onClick={() => typeof page === 'number' ? onPageChange(page) : null}
              disabled={typeof page !== 'number'}
            >
              {typeof page === 'number' ? page : <FaEllipsisH className="pagination-icon" />}
            </button>
          </li>
        ))}
        
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link custom-page-link" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight className="pagination-icon" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;