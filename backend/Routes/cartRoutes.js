import express from "express";
import {
  addToCart,
  getCart,
  removeAllFromCart,
  updateQuantity,
} from "../Controllers/cartController.js";
import { ProtectRoute } from "../Middlewares/Auth.js";
const router = express.Router();

router.post("/", ProtectRoute, addToCart);
router.delete("/", ProtectRoute, removeAllFromCart);
router.put("/:id", ProtectRoute, updateQuantity);
router.get("/", ProtectRoute, getCart);
export default router;
