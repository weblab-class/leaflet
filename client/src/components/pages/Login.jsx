import React, { useContext, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../utilities.css";

const Login = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // If the user is logged in, redirect to the home page
    if (userId) {
      console.log("Redirecting to home!");
      navigate("/Home");
    }
  }, [userId, navigate]); // Run whenever userId changes

  return (
    <div>
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
      <h1>Welcome to the Login Page</h1>
    </div>
  );
};

export default Login;
