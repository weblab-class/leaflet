import React, { useContext, useEffect } from "react";
import { UserContext } from "../App";
// import NavBar from "../modules/NavBar";
import { useNavigate } from "react-router-dom";
import Shelf from "../modules/Shelf";
import NavBarHome from "../modules/NavBarHome";

const Home = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      ("Redirecting to Login!");
      navigate("/");
    }
    ("Loading the home page");
  }, [userId, navigate]);

  return (
    <div className="background">
      <NavBarHome />
      <Shelf className="shelf" />
    </div>
  );
};

export default Home;
