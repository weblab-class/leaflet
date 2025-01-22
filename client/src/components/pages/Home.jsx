import React, { useContext } from "react";
import { UserContext } from "../App";
import NavBar from "../modules/NavBar";
import Shelf from "../modules/Shelf";

const Home = () => {
  const { userId } = useContext(UserContext);
  return (
    <div className="background">
        <h1 className="top-text">Welcome to the Home Page!</h1>
        <Shelf className="shelf"/>
    </div>
  );
};

export default Home;
