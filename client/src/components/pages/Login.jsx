import React, { useContext, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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
    <div className="Login-background">
      <div className="Login-darken-background">
        <div className="Login-content">
          <h1 className="Login-header">Welcome to the Login Page!</h1>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
