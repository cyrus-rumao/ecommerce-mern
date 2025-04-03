import express from "express";
const router = express.Router();
import { ProtectRoute } from "../Middlewares/Auth.js";
import { createCheckoutSession, purchaseSuccess } from "../Controllers/paymentController.js";
router.post("/create-checkout-session", ProtectRoute, createCheckoutSession);
router.post("/checkout-success", ProtectRoute, purchaseSuccess);
export default router;