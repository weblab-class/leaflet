import React, { useContext, useEffect } from "react";
import { UserContext } from "../App";
// import NavBar from "../modules/NavBar";
import { useNavigate } from "react-router-dom";
import Shelf from "../modules/Shelf";

const Home = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      console.info("Redirecting to Login!");
      navigate("/");
    }
    console.info("Loading the home page");
  }, [userId, navigate]);

  return (
    <div className="background">
      <h1 className="top-text">Welcome to the Home Page!</h1>
      <Shelf className="shelf" />
    </div>
  );
};

export default Home;
