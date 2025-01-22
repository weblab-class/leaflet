import React, { useContext, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../../utilities.css";

const Login = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      console.info("Redirecting to home!");
      navigate("/Home");
    }
  }, [userId, navigate]);

  return (
    <div className="background">
      <div className="content">
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
    </div>
  );
};

export default Login;
