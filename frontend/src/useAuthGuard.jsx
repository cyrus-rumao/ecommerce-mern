import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const useAuthGuard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8080/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const isAuthenticated = res.data.accessToken;

        if (isAuthenticated) {
          if (location.pathname === "/login" || location.pathname === "/signup") {
            navigate("/");
          }
        } else {
          if (location.pathname !== "/login" && location.pathname !== "/signup") {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Auth Check Failed:", error);
        if (location.pathname !== "/login" && location.pathname !== "/signup") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location]);

  return loading; // Prevents UI flashing while checking auth
};

export default useAuthGuard;
