import express from "express";
import Product from "../Models/productModel.js";
import { redis } from "../Config/redis.js";
import { TimeSeriesAggregationType } from "redis";
import cloudinary from "../Config/cloudinary.js";
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    // console.log("Products", products);
    res.json({ products });
  } catch (error) {
    res.status(404).json({ message: "This is the message" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await redis.get("featured_products");
    if (featured) {
      return res.json(JSON.parse(featured));
    }

    featured = await Product.find({ isFeatured: true }).lean();
    if (!featured) {
      return res.status(404).json({ message: "Featured products not found" });
    }
    await redis.set("featured_products", JSON.stringify(featured));
    res.json(featured);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, images, category } = req.body;
    let cloudinaryResponse = null;
    if (images) {
      cloudinaryResponse = await cloudinary.uploader.upload(images, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      images: cloudinaryResponse
        ? {
            secure_url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id,
          }
        : null,
      category,
    });
    // console.log("Stop 1");
    await updateFeaturedProductsCache();
    return res.status(201).json({ product, message: "Product created successfully" });
    console.log("Product created successfully", product);
    // console.log("Product Category", product.category);
    // console.log("Stop 2");
  } catch (error) {
    // console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    // console.log("Product to delete", product);
    // console.log("product image", product.images);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      // const publicID = product.images.split("/").pop().split(".")[0];
      try {
        if (product.images?.public_id) {
          await cloudinary.uploader.destroy(product.images.public_id);
        }
        // console.log(`Deleted image from Cloudinary`);
      } catch (error) {
        // console.log("Error in deleting image");
      }
      // await product.remove();
      // res.status(200).json({ message: "Product deleted successfully" });
    }
    await Product.findByIdAndDelete(req.params.id);
    await updateFeaturedProductsCache();
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};

export const getRecomendedProducts = async (req, res) => {
  await updateFeaturedProductsCache();
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          images: 1,
          _id: 1,
        },
      },
    ]);

    return res.json(products);
  } catch (error) {
    console.log("Error in getting recommended products", error);
    return res.status(404).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    return res.json(products);
  } catch (error) {
    console.log("Error in getting products by category", error);
    return res.status(404).json({ message: error.message });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      updateFeaturedProductsCache();
      return res.json(updatedProduct);
      return res.status(200).json({ message: "Product updated successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};

const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    return await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in update cache function!", error);
  }
};
