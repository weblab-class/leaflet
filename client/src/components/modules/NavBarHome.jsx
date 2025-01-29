import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import "./NavBarHome.css";

const NavBarHome = (props) => {
  const { userId, handleLogout } = useContext(UserContext);

  return (
    <nav className="NavBarHome-container">
      <div className="NavBarHome-background"></div>
      <div className="NavBarHome-title">
        <img
          src="/assets/leaflet_title.png"
          style={{ width: "230px", padding: "10px", marginTop: "30px" }}
        />
      </div>
      <button onClick={handleLogout} className="NavBarHome-link">
        Sign out
      </button>
    </nav>
  );
};

export default NavBarHome;
