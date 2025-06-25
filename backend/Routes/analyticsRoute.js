import express from "express";
const router = express.Router();
import { ProtectRoute } from "../Middlewares/Auth.js";
import { getAnalytics } from "../Controllers/analyticsController.js";
router.get("/", ProtectRoute, getAnalytics);
export default router;
