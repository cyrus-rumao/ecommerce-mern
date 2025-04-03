import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Routers from "./Routes";
import Navbar from "../Components/Navbar";
import { Toaster } from "sonner";
const App = () => {
  return (
    <div className="max-h-screen overflow-hidden relative">
      <Router>
        <Navbar />
        <Routers />
        <Toaster  richColors/>
      </Router>
    </div>
  );
};

export default App;
