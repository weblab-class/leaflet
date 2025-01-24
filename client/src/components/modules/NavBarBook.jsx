import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import "./NavBarBook.css";

const NavBarBook = (props) => {
  const { userId, handleLogout } = useContext(UserContext);

  return (
    <nav className="NavBarBook-container">
      <div className="NavBarBook-background"></div>
      <Link to="/Home" className="NavBarBook-link">
        Home
      </Link>
      <button onClick={handleLogout} className="NavBarBook-link">
        Sign out
      </button>
    </nav>
  );
};

export default NavBarBook;
