/*eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { handleError, handleSuccess } from "../lib/utils";
import axios from "axios";
import axiosInstance from "../lib/axiosInstance";
import { useAuth } from "../lib/AuthContext";
const Login = () => {
  const { currentUser, setCurrentUser } = useAuth();
// const {currentUser} = useAuth()
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    if (email.includes("@") === false) {
      return handleError("Invalid Email");
    }
    if (password.length < 6) {
      return handleError("Password must be at least 6 characters");
    }
    try {
      const response = await axiosInstance.post(
        "/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setCurrentUser(response.data.user);
        //currentUser(response.data.user)
        handleSuccess(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(currentUser)
      console.log("Error in login")
      console.log("Error message", error.message)
      console.log("Error response", error.response?.data?.message)
      handleError(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 px-6 sm:px-10 md:px-16 lg:px-24">
      {/* Fancy Jellyfish Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 opacity-40 blur-3xl" />
      <div className="absolute top-1/4 left-1/3 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-purple-500 opacity-30 blur-[120px] sm:blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-64 sm:w-72 md:w-80 h-64 sm:h-72 md:h-80 bg-blue-500 opacity-30 blur-[120px] sm:blur-[150px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg z-10 bg-gray-800 p-6 sm:p-8 md:p-10 rounded-lg shadow-lg backdrop-blur-md"
      >
        <h2 className="text-gray-100 text-2xl sm:text-3xl font-bold text-center mb-6">
          Login
        </h2>
        <form className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-400 focus:outline-none"
            required
          />
          <div className="relative w-full">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-400 focus:outline-none"
              required
            />
            <button
              tabIndex={-1}
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 sm:py-4 rounded-lg transition"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-400 font-semibold underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
export default Login;
