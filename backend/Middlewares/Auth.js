import jwt from "jsonwebtoken";
import { redis } from "../redis.js";
import User from "../Models/User.js";
import bcrypt from "bcrypt";

export const ProtectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
      return res.status(401).json({ message: "Unauthenticated" });

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token Expired" });
      }
    }
  } catch (error) {
    console.log("Error in Protect Route", error);
    return res
      .status(500)
      .json({ message: "Unauthorised- Invalid Access Token" });
  }
};
