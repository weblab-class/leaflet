import React, { useEffect, useState } from "react";
import "./Book.css";

// **************** NEWLY ADDED *************** //
const Book = ({ leftPage, rightPage }) => {
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    // Trigger flip animation whenever pages change
    setFlipping(true);
    const timer = setTimeout(() => setFlipping(false), 500); // Animation duration
    return () => clearTimeout(timer);
  }, [leftPage, rightPage]);

  return (
    <div className={`Book-container ${flipping ? "flipping" : ""}`}>
      <div className="Book-page Book-left">
        <p>{leftPage}</p>
      </div>
      <div className="Book-page Book-right">
        <p>{rightPage}</p>
      </div>
    </div>
  );
};

export default Book;
