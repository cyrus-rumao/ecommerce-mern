import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Routers from "./Routes";
import Navbar from "./Components/Navbar";
import { Toaster } from "sonner";
import { useAuth } from "./lib/AuthContext";
import LoadingSpinner from "./Components/LoadingSpinner";
// import { checkAuth } from "./lib/axiosInstance";
const App = () => {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner />
  return (
    <div className="max-h-screen overflow-hidden relative h-screen w-full bg-[radial-gradient(circle,_rgba(64,0,128,1)_0%,_rgba(18,18,63,1)_100%)]">
      <Router>
        <Navbar/>
        <Routers />
        <Toaster richColors />
      </Router>
    </div>
  );
};

export default App;
