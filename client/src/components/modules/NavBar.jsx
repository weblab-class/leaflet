import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { get, post } from "../../utilities";
import "./NavBar.css";

import { UserContext } from "../App";

const NavBar = (props) => {
  const userId = useContext(UserContext);

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
