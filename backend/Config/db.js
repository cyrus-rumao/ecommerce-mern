import mongoose from "mongoose";
import dotenv from "dotenv";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // console.log("✅ Database Connected ✅");
  } catch (error) {
    // console.log("❌ Database Connection Failed ❌");
    // console.log(error);
    process.exit(1);
  }
};
