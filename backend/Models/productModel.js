import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: {
      secure_url: { type: String, required: [true, "Image is required"] },
      public_id: { type: String, required: [true, "Image is required"] },
    },
    category: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    // inStock: { type: Number, required: true, min: 0 },
    // rating: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
