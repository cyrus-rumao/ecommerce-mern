import express from "express";
import { ProtectRoute } from "../Middlewares/Auth.js";
import { getCoupon, validateCoupon } from "../Controllers/couponController.js";
const router = express.Router();

router.get("/", ProtectRoute, getCoupon);
router.post("/validate", ProtectRoute, validateCoupon);

export default router;
