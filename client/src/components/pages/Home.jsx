import React, { useContext } from "react";
import { UserContext } from "../App";
import NavBar from "../modules/NavBar";
import Shelf from "../modules/Shelf";

const Home = () => {
  const { userId } = useContext(UserContext);
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <p>This is where you can explore content after logging in.</p>
      <Shelf />
    </div>
  );
};

export default Home;
