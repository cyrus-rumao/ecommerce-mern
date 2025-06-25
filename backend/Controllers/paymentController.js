// import { model } from "mongoose";
import Coupon from "../Models/couponModel.js";
import { stripe } from "../Config/stripe.js";
import dotenv from "dotenv";
// import { response } from "express";
import Order from "../Models/orderModel.js";
dotenv.config();
let couponCode = null;
export const createCheckoutSession = async (req, res) => {
  let totalAmount = 0;
  try {
    const { products, couponCode } = req.body;
    console.log("User id: ", req.user._id);
    console.log(products);
    console.log("Coupon Code: ", couponCode);
    if (!Array.isArray(products) || !products.length) {
      return res.status(400).json({ message: "No products provided" });
    }
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      console.log("Amount for product:", product.name, amount);
      totalAmount += amount * product.quantity;
      console.log("Total Amount so far:", totalAmount);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.images.secure_url],
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    }
    );

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        // cuuponCode = coupon.code;
        // console.log("Coupon Code:", cuuponCode);
        console.log("Coupon found:", coupon);
        totalAmount = Math.round(
          totalAmount * (1 - coupon.discountPercentage / 100)
        );
        console.log("Total Amount after applying coupon:", totalAmount);
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
            coupon: await createStripeCoupon(coupon.discountPercentage),
              
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || " z",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });
    console.log("Session Coupon", coupon);
    console.log("Session created:", session.id);
    console.log("Total Amount: ", totalAmount)
    if (totalAmount >= 50000) {
 
      await createNewCoupon(req.user._id);
    }

    return res.status(200).json({
      id: session.id,
      totalAmount: totalAmount / 100,
      message: "Checkout session created successfully",
    });
  } catch (error) {
    console.log("Error in making Session", error);
    res
      .status(500)
      .json({ message: "Error in making session", error: error.message });
  }
};

const createStripeCoupon = async (discountPercentage) => {

  const stripeCoupon = await stripe.coupons.create({
    duration: "once",
    // duration_in_months: 1,
    percent_off: discountPercentage,
  });
  return stripeCoupon.id;
};

const createNewCoupon = async (userId) => {
  console.log("Creating new coupon for user:", userId);
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  await newCoupon.save();
  console.log("New coupon created:", newCoupon);
  return newCoupon;
};

export const purchaseSuccess = async (req, res) => {
  console.log("Coupon Code      biybkf      :", couponCode);
  try {
    const { sessionId } = req.body;
    console.log("Session ID:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    console.log("Session details:", session);
    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
            isActive: true,
          },
          {
            isActive: false,
          }
        );
      }
      else {
        return res.status(400).json({
          message: "No coupon code found in session metadata",
          success: false,
        });
      }

      //cerate a new order
      const products = JSON.parse(session.metadata.products);
      console.log("Products from session metadata:", products);
      
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((p) => ({
          product: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
      });

      await newOrder.save();
      res
        .status(200)
        .json({
          message: "Order created successfully",
          success: true,
          orderId: newOrder._id,
        });
    }
  } catch (error) {
    console.log("Error processing checkout", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
};
