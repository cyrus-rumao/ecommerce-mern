import express from "express";
import Product from "../Models/productModel.js";
import { redis } from "../redis.js";
import { TimeSeriesAggregationType } from "redis";
import cloudinary from "../Config/cloudinary.js";
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // get everything
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await redis.get("featured_products");
    if (featured) {
      return res.json(JSON.parse(featured));
    }

    //if not in redis, fetch from mongoose
    //lean() is used to convert mongoose document to plain JS object which is good for performance
    featured = await Product.find({ isFeatured: true }).lean();
    if (!featured) {
      return res.status(404).json({ message: "Featured products not found" });
    }
    await redis.set("featured_products", JSON.stringify(featured));
    res.json(featured);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, images, category } = req.body;
    let cloudinaryResponse = null;
    if (iamge) {
      cloudinaryResponse = await cloudinary.uploader.upload(images, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      images: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      const publicID = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicID}`);
        console.log(`Deleted image from Cloudinary`);
      } catch (error) {
        console.log("Error in deleteing image");
      }
      await product.remove();
      res.status(200).json({ message: "Product deleted successfully" });
    }
    await Product.findByIdandRemove(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getRecomendedProducts = async (req, res) => {
  try {
    const products = Product.aggregate([
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

    res.json(products);
  } catch (error) {
    console.log("Error in getting recommended products",error)
    res.status(404).json({ message: error.message });
  }
};
 
export const getProductsByCategory = async (req, res) => { 
  const {category} = req.params
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.log("Error in getting products by category", error)
    res.status(404).json({ message: error.message });
  }
}

export const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache()
      res.json(updatedProduct);
      res.status(200).json({ message: "Product updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message }); 
  }
};

const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in update cache function!",error)
  }
}