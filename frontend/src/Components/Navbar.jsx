/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBag,
  MonitorCog,
  LogOut,
  LogIn,
  UserPlus,
  ShoppingCart,
} from "lucide-react";
import axiosInstance, { checkAuth } from "../lib/axiosInstance"; // Import the checkAuth function
import axios from "axios";
import { useAuth } from "../lib/authContext"; // Import the AuthContext

const Navbar = () => {
  const { currentUser, setCurrentUser } = useAuth(); // Authenticated user
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Assuming this is determined from the backend
  const [loggedIn, setLoggedIn] = useState(false);
  const [count, setCount] = useState(3); // Cart count
  // const [currentUser, setCurrentUser] = useState(null); // Authenticated user
  // if (user) {
  //   setCurrentUser(user); // Set the authenticated user
  // }

  // console.log("User from Navbar:", user);
  // setUser(user); // Set the authenticated user
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {});
      setCurrentUser(null);
      navigate("/login");
      console.log("logged out");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  // setCurrentUser(user); // Set the authenticated user
  return (
    <header>
      <nav className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-200 hover:text-white"
          >
            ShopSphere
          </Link>
          <div className="hidden md:flex space-x-6 justify-center items-center">
            <Link to="/" className="text-gray-300 hover:text-white transition">
              Home
            </Link>
            {currentUser && (
              <Link to="/cart" className="relative">
                <button className="text-gray-300 hover:text-white transition text-semibold p-2 rounded-xl flex items-center">
                  <ShoppingCart className="text-gray-300" />
                  <span className="px-2">Cart</span>
                  {count > 0 && (
                    <span className="absolute -top-2 -left-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </button>
              </Link>
            )}
            {currentUser && isAdmin && (
              <Link to="/dashboard">
                <button className="text-gray-300 hover:text-white transition bg-purple-700 hover:bg-purple-800 text-semibold p-2 rounded-xl flex">
                  <MonitorCog className="mr-2 text-black" />
                  Dashboard
                </button>
              </Link>
            )}
            {currentUser ? (
              <button
                className="bg-gray-800 p-2 flex rounded-lg hover:bg-gray-700 items-center transition"
                onClick={handleLogout}
                type="button"
              >
                <LogOut
                  className="text-gray-300 hover:text-white transition"
                  size={20}
                />
                <span className="font-semibold">Logout</span>
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="bg-gray-800 p-2 rounded-lg flex hover:bg-gray-700 items-center transition">
                    <LogIn
                      className="text-gray-300 mr-2 hover:text-white transition"
                      size={20}
                    />
                    <span className="font-semibold mx-auto">Login</span>
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-purple-800 p-2 rounded-lg flex hover:bg-gray-700 items-center transition">
                    <UserPlus
                      className="text-gray-300 mr-2 hover:text-white transition"
                      size={20}
                    />
                    <span className="font-semibold mx-auto">Signup</span>
                  </button>
                </Link>
              </>
            )}
          </div>
          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-4 p-4 bg-gray-800 border-t border-gray-700">
            <Link
              to="/about"
              className="text-gray-300 hover:text-white transition"
            >
              About
            </Link>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-gray-300 hover:text-white transition"
            >
              Signup
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
