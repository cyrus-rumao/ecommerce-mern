import React from "react";
import {
  Navigate,
  Routes,
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { useAuth } from "./lib/AuthContext";
// import { useState } from "react";
// import { checkAuth } from "./lib/axiosInstance";
// import axiosInstance from "./lib/axiosInstance";
const Routers = () => {
  const { currentUser } = useAuth(); // Authenticated user
  // const [user, setUser] = useState(null); // Authenticated user
  console.log("Currwent User from Routers:", currentUser);
  // const [loading, setLoading] = useState(true); // Auth check loading state

  // console.log(user);
  // if (loading) return <div>Loading...</div>;
  // console.log("User from Routers:", user);
  return (
    <Routes>
      <Route
        path="/"
        element={currentUser ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/signup"
        element={!currentUser ? <Signup /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!currentUser ? <Login /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default Routers;
