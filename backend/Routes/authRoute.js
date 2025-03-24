import Router from "express";
import express from "express";
import {
  signupvalidation,
  loginvalidation,
} from "../Middlewares/AuthValidation.js";
import { login, signup, logout, refreshToken, getProfile } from "../Controllers/auth.js";
import { get } from "mongoose";
const router = express.Router();
router.post("/login", loginvalidation, login);
router.post("/signup", signupvalidation, signup);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", getProfile)

export default router;
