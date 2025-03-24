import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/authRoute.js";
import prodRoute from "./Routes/prodRoute.js";
import cartRoutes from "./Routes/cartRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./Config/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000 || 8000;
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
connectDB();
app.get("/hello", (req, res) => {
  res.send("nigga");
});
app.use("/api/auth", authRoute);
app.use("/api/products", prodRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes)
// console.log(process.env.REDIS_URI);

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
