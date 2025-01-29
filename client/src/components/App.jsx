import React, { useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import jwt_decode from "jwt-decode";

import "../utilities.css";

import { socket } from "../client-socket";

import { get, post } from "../utilities";

export const UserContext = createContext(null);

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);
  const navigate = useNavigate();
  const [isSoundOn, setIsSoundOn] = useState(false);

  // **************** TODO *************** //
  // It seems that you get 'logged out' after a while on the website
  // (idk why), for safety measures, we should 'kick out' people
  // if they're no longer logged in back onto the Login page
  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
    setUserId(null);
    navigate("/");
  };

  const authContextValue = {
    userId,
    handleLogin,
    handleLogout,
  };

  return (
    <UserContext.Provider value={authContextValue}>
      <Outlet context={{ isSoundOn, setIsSoundOn }} />
    </UserContext.Provider>
  );
};

export default App;
