import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import Shelf from "../modules/Shelf.jsx";

import "../../utilities.css";
import { UserContext } from "../App";

const Home = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <>
      <>
        {userId ? (
          <button
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
        )}
      </>
      <>Hi! This is the home page :D</>
      <Shelf />
    </>
  );
};

export default Home;
