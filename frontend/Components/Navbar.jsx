/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [count, setCount] = useState(3);
  return (
    <header>
      <nav className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-200 hover:text-white"
          >
            E-Commerce
          </Link>
          <div className="hidden md:flex space-x-6 justify-center items-center">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition"
            >
              Home
            </Link>
            {loggedIn && (
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
            {loggedIn && isAdmin && (
              <Link to="/dashboard">
                <button className="text-gray-300 hover:text-white transition bg-purple-700 hover:bg-purple-800 text-semibold p-2 rounded-xl flex">
                  <MonitorCog className="mr-2 text-black" />
                  Dashboard
                </button>
              </Link>
            )}
            {loggedIn ? (
              <button className="bg-gray-800 p-2 flex rounded-lg hover:bg-gray-700  items-center transition">
                <LogOut
                  className="text-gray-300 hover:text-white transition "
                  size={20}
                />
                <span className="font-semibold">Logout</span>
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="bg-gray-800 p-2 rounded-lg flex hover:bg-gray-700 items-center transition">
                    {/* <LogOut className="mr-2 text-gray-300" /> */}
                    <LogIn
                      className="text-gray-300 mr-2 hover:text-white transition"
                      size={20}
                    />
                    <span className="font-semibold mx-auto">Login</span>
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-purple-800 p-2 rounded-lg flex hover:bg-gray-700  items-center transition">
                    {/* <LogOut className="mr-2 text-gray-300" /> */}
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
              Home
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
