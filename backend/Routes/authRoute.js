import Router from "express";
import express from "express";
import {
  signupvalidation,
  loginvalidation,
} from "../Middlewares/AuthValidation.js";
import {
  login,
  signup,
  logout,
  refreshToken,
  getProfile,
} from "../Controllers/authController.js";
import { get } from "mongoose";
import { ProtectRoute } from "../Middlewares/Auth.js";
const router = express.Router();
router.post("/login", loginvalidation, login);
router.post("/signup", signupvalidation, signup);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", ProtectRoute, getProfile);

export default router;
