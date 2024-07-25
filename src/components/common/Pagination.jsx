import React from 'react';
import * as Icons from "react-icons/tb";

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  const handlePageChange = (pageNumber) => {
    if (onPageChange) {
      onPageChange(pageNumber);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 1) {
      return pageNumbers;
    }

    const firstPage = 1;
    const secondPage = 2;
    const lastPage = totalPages;
    const secondLastPage = totalPages - 1;

    if (currentPage > 3) {
      pageNumbers.push(
        <li key={firstPage} className={`${currentPage === firstPage ? 'active' : ''}`} onClick={() => handlePageChange(firstPage)}>
          {firstPage}
        </li>
      );
      pageNumbers.push(<li key="dots1" className="dots">...</li>);
    }

    if (currentPage > 2) {
      pageNumbers.push(
        <li key={currentPage - 1} className={`${currentPage === currentPage - 1 ? 'active' : ''}`} onClick={() => handlePageChange(currentPage - 1)}>
          {currentPage - 1}
        </li>
      );
    }

    pageNumbers.push(
      <li key={currentPage} className="active" onClick={() => handlePageChange(currentPage)}>
        {currentPage}
      </li>
    );

    if (currentPage < totalPages - 1) {
      pageNumbers.push(
        <li key={currentPage + 1} className={`${currentPage === currentPage + 1 ? 'active' : ''}`} onClick={() => handlePageChange(currentPage + 1)}>
          {currentPage + 1}
        </li>
      );
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(<li key="dots2" className="dots">...</li>);
      pageNumbers.push(
        <li key={lastPage} className={`${currentPage === lastPage ? 'active' : ''}`} onClick={() => handlePageChange(lastPage)}>
          {lastPage}
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className={`pagination ${className ? className : ""}`}>
      <ul>
        <li className="prev" onClick={handlePrevClick}>
          <Icons.TbChevronLeft />
        </li>
        {renderPageNumbers()}
        <li className="next" onClick={handleNextClick}>
          <Icons.TbChevronRight />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
