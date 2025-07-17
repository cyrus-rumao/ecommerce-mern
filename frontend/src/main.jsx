import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <AuthProvider>
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster richColors />
    </BrowserRouter>
    </StrictMode>
      </AuthProvider>
);
