import React, { useEffect, useState } from "react";
import "./Book.css";

// **************** NEWLY ADDED *************** //
const Book = ({ leftPage, rightPage }) => {
  const [flipping, setFlipping] = useState(false);
  const [initialRender, setInitialRender] = useState(true);


  useEffect(() => {
    // Trigger flip animation only when pages change
    if (initialRender) {
      setInitialRender(false);
      return;
    }
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
