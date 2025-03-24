import express from "express";
import { ProtectRoute } from "../Middlewares/Auth";
import { getCoupon, validateCoupon } from "../Controllers/couponController";
const router = express.Router();

router.get("/", ProtectRoute, getCoupon);
router.get("/validate", ProtectRoute, validateCoupon);
export default router;
