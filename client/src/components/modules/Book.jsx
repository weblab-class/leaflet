import React, { useEffect, useState } from "react";
import "./Book.css";

const Book = ({ bookWindow, flipDirection, boolFlippedPage }) => {
  // const [leftFlipping, setLeftFlipping] = useState(false);
  // const [rightFlipping, setRightFlipping] = useState(false);

  // useEffect(() => {
  //   console.info("Book component rendered");
  //   if (flippedPage == -1) {
  //     return;
  //   } else if (flippedPage === 0) {
  //     console.log("Left page flips");
  //     // setLeftFlipping(true);
  //     // const timer = setTimeout(() => setLeftFlipping(false), 500); // Animation duration
  //     return () => {
  //       // clearTimeout(timer);
  //       setLeftFlipping(false);
  //     };
  //   } else if (flippedPage === 1) {
  //     console.log("Right page flips");
  //     // setRightFlipping(true);
  //     // const timer = setTimeout(() => setRightFlipping(false), 500); // Animation duration
  //     return () => {
  //       // clearTimeout(timer);
  //       setLeftFlipping(false);
  //       setRightFlipping(false);
  //     };
  //   }
  // }, []);

  // // const leftStyle = {
  // //   zIndex: leftFlipping ? 2 : 1, // Higher z-index when flipping
  // // };

  // // const rightStyle = {
  // //   zIndex: rightFlipping ? 2 : 1, // Higher z-index when flipping
  // // };

  return (
    <div className="Book-container">
      <div
        className={`Book-page Book-left`} //${leftFlipping ? "flipping-left" : ""}
        // style={leftStyle}
      >
        <p>{bookWindow[2]}</p>
      </div>
      <div
        className={`Book-page Book-right`} //${rightFlipping ? "flipping-right" : ""}
        // style={rightStyle}
      >
        <p>{bookWindow[3]}</p>
      </div>
    </div>
  );
};

export default Book;
