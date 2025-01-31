import React, { useEffect, useState } from "react";
import "./Book.css";

const Book = ({ prevSpread, nextSpread, flipDirection, boolFlippedPage }) => {
  const [flipping, setFlipping] = useState(false);

  return (
    <div className="Book-container">
      {/* Left Page */}
      <div className={`Book-page Book-left `}>
        <p>{nextSpread[0]}</p>
      </div>
      {/* Right Page */}
      <div className={`Book-page Book-right`}>
        <p>{nextSpread[1]}</p>
      </div>
    </div>
  );
};

// {flipping && flipDirection === 0 ? "flip-left" : ""}
// {flipping && flipDirection === 1 ? "flip-right" : ""}
export default Book;
