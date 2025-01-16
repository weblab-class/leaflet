import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import "./NavBar.css";

const NavBar = (props) => {
  const { userId, handleLogout } = useContext(UserContext);

  return (
    <nav className="NavBar-container">
      <div className="NavBar-title">Leaflet</div>
      <div className="NavBar-linkContainer">
        <Link to="/Home" className="NavBar-link">
          Home
        </Link>
        <button className="NavBar-link" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
