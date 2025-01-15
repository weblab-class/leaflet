import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import Shelf from "../modules/Shelf.jsx"

import "../../utilities.css";
import { UserContext } from "../App";

const Login = () => {
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
      <>Hi! This is the Login page :D</>
      <Shelf />
    </>
  );
};

export default Login;
