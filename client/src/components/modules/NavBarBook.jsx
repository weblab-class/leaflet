import React, { useContext, useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { UserContext } from "../App";
import { VolumeOff, Volume2 } from "lucide-react";
import "./NavBarBook.css";

const NavBarBook = ({ curPage, totalPages, flipToPage }) => {
  const { userId, handleLogout } = useContext(UserContext);
  const [tempProgress, setTempProgress] = useState(((curPage + 1) / totalPages) * 100);
  const { isSoundOn, setIsSoundOn } = useOutletContext();
  const [showStars, setShowStars] = useState(false);

  // Update tempProgress when curPage or totalPages changes
  useEffect(() => {
    if (curPage === totalPages - 2) {
      setTempProgress(100);
      console.log("Sparkle!");
      setShowStars(true);
      setTimeout(() => {
        setShowStars(false); // Hide stars after 3 seconds
      }, 3000);
    } else if (curPage == 0) {
      setTempProgress(0);
    } else {
      setTempProgress(((curPage + 1) / totalPages) * 100);
    }
  }, [curPage, totalPages]);

  // Handle slider change without snapping
  const handleSliderChange = (event) => {
    setTempProgress(event.target.value);
  };

  // Update the actual page when user releases the slider with snapping
  const handleSliderRelease = () => {
    // Snap the progress to the nearest page
    const snappedProgress = Math.round((tempProgress / 100) * totalPages);
    setTempProgress((snappedProgress / totalPages) * 100); // Update the slider value with snapping effect
    flipToPage(snappedProgress); // Flip to the snapped page
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
          value={tempProgress}
          className="progress-slider"
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease} // For desktop
          onTouchEnd={handleSliderRelease} // For mobile
        />
        <div className="progress-bar" style={{ width: `${tempProgress}%` }} />
      </div>

      {/* Stars Animation */}
      <div className={`stars-container ${showStars ? "show" : ""}`}>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
      </div>

      <div>
        <button onClick={() => setIsSoundOn((prev) => !prev)} className="VolumeToggle-button">
          {isSoundOn ? <Volume2 /> : <VolumeOff />}
        </button>
      </div>
    </nav>
  );
};

export default NavBarBook;
