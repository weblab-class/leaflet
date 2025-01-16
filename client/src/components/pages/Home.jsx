import React, { useContext } from "react";
import { UserContext } from "../App";
import NavBar from "../modules/NavBar";

const Home = () => {
  const { userId } = useContext(UserContext);
  return (
    <div>
      <NavBar />
      <h1>Welcome to the Home Page!</h1>
      <p>This is where you can explore content after logging in.</p>
    </div>
  );
};

export default Home;
