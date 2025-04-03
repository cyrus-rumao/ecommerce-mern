import { motion } from "framer-motion";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, KeyRound, LoaderCircle } from "lucide-react";
import axios from "axios";
import { handleError, handleSuccess } from "../../Components/utils";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      handleError("All fields are required");
      return;
    }
    if (formData.email.includes("@") === false) {
      handleError("Invalid Email");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      // console.log(formData)
      handleError("Passwords Dont Match");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          name:formData.fullName,
          email:formData.email,
          password:formData.password,
        },
        {
          withCredentials: true,
        },
        {
          headers: { "Content-Type": "application/json" }, // Ensure JSON format
        }
      );
      handleSuccess("Account Created Successfully");
      navigate("/login");
      console.log(response);
    } catch (error) {
      handleError(error.response.data.message);
    }
    console.log("Form Submitted:", formData);
    // Proceed with form submission (e.g., API call)
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 p-4">
      {/* Fancy Jellyfish Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 opacity-40 blur-3xl" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500 opacity-30 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500 opacity-30 blur-[150px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-md z-10 bg-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-md"
      >
        <h2 className="text-gray-100 text-3xl font-bold text-center mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-400 focus:outline-none"
            />
          </div>
          <input
            // type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-400 focus:outline-none"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-purple-400 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 font-semibold underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
