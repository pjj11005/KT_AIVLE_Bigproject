import React from 'react';
import styles from './Pagenation.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 5) {
        for (let i = 1; i <= 7; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage > totalPages - 5) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 6; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ margin: '0 5px' }}
            className={styles['arrow-icon']}
          >
            &lt;
          </button>
        </li>
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span style={{ margin: '0 5px' }}>...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                disabled={page === currentPage}
                style={{
                  margin: '0 5px',
                  fontWeight: page === currentPage ? 'bold' : 'normal',
                }}
                className={styles['number']}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ margin: '0 5px' }}
            className={styles['arrow-icon']}
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
