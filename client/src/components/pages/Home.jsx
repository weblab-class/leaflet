import React, { useContext } from "react";
import { UserContext } from "../App";

const Home = () => {
  const userId = useContext(UserContext);
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <p>This is where you can explore content after logging in.</p>
    </div>
  );
};

export default Home;
