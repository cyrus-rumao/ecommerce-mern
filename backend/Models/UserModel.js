import mongoose from "mongoose";
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    cartItems: [
      {
        quantity: { type: Number, default: 1 },
        product: { type: Schema.Types.ObjectId, ref: "Product" },
      },
    ],
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin"],
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", UserSchema, "User");
export default User;
