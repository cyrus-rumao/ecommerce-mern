import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/authRoute.js";
import prodRoute from "./Routes/prodRoute.js";
import cartRoutes from "./Routes/cartRoutes.js";
import couponRoutes from "./Routes/couponRoute.js"
import paymentRoutes from "./Routes/paymentRoutes.js"
import analyticsRoute from "./Routes/analyticsRoute.js"

import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
dotenv.config();
connectDB();

const PORT = process.env.PORT;
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("world");
});
// res.cookie("test", "HelloWorld", { httpOnly: true });
app.use("/api/auth", authRoute);
app.use("/api/products", prodRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/analytics", analyticsRoute)


app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});