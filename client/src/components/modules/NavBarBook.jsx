import React, { useContext, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { UserContext } from "../App";
import { VolumeOff, Volume2 } from "lucide-react";
import "./NavBarBook.css";

const NavBarBook = ({ curPage, totalPages, flipToPage }) => {
  const { userId, handleLogout } = useContext(UserContext);
  const [tempProgress, setTempProgress] = useState(((curPage + 1) / totalPages) * 100);
  const { isSoundOn, setIsSoundOn } = useOutletContext();

  // Handle slider change without snapping
  const handleSliderChange = (event) => {
    setTempProgress(event.target.value);
  };

  // Update the actual page when user releases the slider
  const handleSliderRelease = () => {
    const newPage = Math.round((tempProgress / 100) * totalPages);
    flipToPage(newPage);
  };

  const handleSoundToggle = () => {
    if (soundOn) {
      soundOn = False;
    } else {
      soundOn = True;
    }
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

      <div>
        <button onClick={() => setIsSoundOn((prev) => !prev)} className="VolumeToggle-button">
          {isSoundOn ? <Volume2 /> : <VolumeOff />}
        </button>
      </div>
    </nav>
  );
};

export default NavBarBook;
