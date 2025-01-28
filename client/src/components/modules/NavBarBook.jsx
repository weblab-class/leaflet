import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import "./NavBarBook.css";

const NavBarBook = ({ curPage, totalPages, flipToPage }) => {
  const { userId, handleLogout } = useContext(UserContext);

  const progress = ((curPage + 1) / totalPages) * 100; // Calculate progress as percentage

  // Handle slider change
  const handleSliderChange = (event) => {
    const newPage = Math.round((event.target.value / 100) * totalPages);
    flipToPage(newPage); // Call flipToPage function when slider is adjusted
  };

  return (
    <nav className="NavBarBook-container">
      <div className="NavBarBook-background"></div>
      <Link to="/Home" className="NavBarBook-link">
        Home
      </Link>
      <button onClick={handleLogout} className="NavBarBook-link">
        Sign out
      </button>

      {/* Progress Bar */}
      <div className="progress-container">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          className="progress-slider"
          onChange={handleSliderChange}
        />
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </nav>
  );
};

export default NavBarBook;
