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
// import useAuthGuard from "./useAuthGuard"; // Importing auth guard

const Routers = () => {
  // const isLoading = useAuthGuard(); // Call useAuthGuard to handle authentication redirects

  // if (isLoading) return null; // Prevent UI flickering while checking authentication

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Catch-all route to redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Routers;