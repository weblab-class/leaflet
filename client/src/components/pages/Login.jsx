import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { UserContext } from "../App";

const Login = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

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
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const user = {
              id: credentialResponse.clientId, // Replace with actual user data
            };
            handleLogin(user);
          }}
          onError={() => console.log("Login Failed")}
        />
      )}
      <h1>Welcome to the Login Page</h1>
    </div>
  );
};

export default Login;
