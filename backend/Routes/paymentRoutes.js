import express from "express";
const router = express.Router();
import { ProtectRoute } from "../Middlewares/Auth.js";
import { createCheckoutSession } from "../Controllers/paymentController.js";
router.post("/create-checkout-session", ProtectRoute, createCheckoutSession);

export default router;