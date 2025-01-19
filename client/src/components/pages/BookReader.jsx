import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Book from "../modules/Book";

// **************** NEWLY ADDED *************** //
const BookReader = () => {
  const location = useLocation();
  const curBook = location.state?.book; // Retrieve the book from state
  const [currentPage, setCurrentPage] = useState(curBook.currentPage);

  if (!curBook) {
    return <div>Error: No book data found.</div>; // Handle missing book data
  }

  useEffect(() => {
    if (currentPage === 0) {
      setCurrentPage(0); // Ensure it stays at the first page
    }
  }, []);

  const getLeftPage = () => {
    console.log("left page: " + JSON.stringify(curBook.content[curBook.currentPage]));
    return curBook.content[curBook.currentPage] || "";
  };

  const getRightPage = () => {
    console.log("right page: " + JSON.stringify(curBook.content[curBook.currentPage + 1]));
    return curBook.content[curBook.currentPage + 1] || "";
  };

  const flipForward = () => {
    if (currentPage < curBook.totalPages - 2) {
      setCurrentPage((prev) => prev + 2); // Move forward by two pages
    }
  };

  const flipBackward = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 2); // Move backward by two pages
    }
  };

  return (
    <div className="BookReader-container">
      <button onClick={flipBackward} disabled={currentPage === 0}>
        Previous
      </button>
      <button onClick={flipForward} disabled={currentPage >= curBook.totalPages.length - 2}>
        Next
      </button>
      <Book leftPage={getLeftPage()} rightPage={getRightPage()} />
    </div>
  );
};

export default BookReader;
