import React, { useEffect, useState } from "react";
import "./Book.css";

const Book = ({ leftPage, rightPage, flippedPage }) => {
  const [leftFlipping, setLeftFlipping] = useState(false);
  const [rightFlipping, setRightFlipping] = useState(false);
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
      return;
    }

    if (flippedPage === 0) {
      setLeftFlipping(true);
      const timer = setTimeout(() => setLeftFlipping(false), 500); // Animation duration
      return () => clearTimeout(timer);
    } else if (flippedPage === 1) {
      setRightFlipping(true);
      const timer = setTimeout(() => setRightFlipping(false), 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [flippedPage]);

  const leftStyle = {
    zIndex: leftFlipping ? 2 : 1, // Higher z-index when flipping
  };

  const rightStyle = {
    zIndex: rightFlipping ? 2 : 1, // Higher z-index when flipping
  };

  return (
    <div className="Book-container">
      <div
        className={`Book-page Book-left ${leftFlipping ? "flipping-left" : ""}`}
        style={leftStyle}
      >
        <p>{leftPage}</p>
      </div>
      <div
        className={`Book-page Book-right ${rightFlipping ? "flipping-right" : ""}`}
        style={rightStyle}
      >
        <p>{rightPage}</p>
      </div>
    </div>
  );
};

export default Book;
