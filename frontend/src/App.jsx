import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Routers from "./Routes";
import Navbar from "./Components/Navbar";
import { Toaster } from "sonner";
// import { checkAuth } from "./lib/axiosInstance";
const App = () => {
  return (
    <div className="max-h-screen overflow-hidden relative">
      <Router>
        <Navbar />
        <Routers />
        <Toaster richColors />
      </Router>
    </div>
  );
};

export default App;
