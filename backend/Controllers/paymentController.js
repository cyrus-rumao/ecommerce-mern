import { model } from "mongoose";
import Coupon from "../Models/couponModel.js";
import { stripe } from "../Config/stripe.js";
import dotenv from "dotenv";
import { response } from "express";
import Order from "../Models/orderModel.js";
dotenv.config();
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || !products.length) {
      return res.status(400).json({ message: "No products provided" });
    }
    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * products.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.images],
          },
          unit_amount: amount,
        },
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.FindOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount = Math.round(
          totalAmount * (1 - coupon.discountPercentage / 100)
        );
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
                id: p.id,
                quantity: p.quantity,
                price: p.price,
              }))
            ),
          },
        });
        if (totalAmount >= 20000) {
          await cerateNewCoupon(req.user._id);
        }
      }
    }
    res.status(200).json({
      id: session.id,
      totalAmount: totalAmount / 100,
    });
  } catch (error) {
    console.log("Error in making Session", error);
    res.status(500).json({ message: "Error in making session", error:error.message });
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

const cerateNewCoupon = async (userId) => {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
  await newCoupon.save();
  return newCoupon;
};

export const purchaseSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
            isActive: false,
          },
          {
            isActive: false,
          }
        );
      }

      //cerate a new order
      const products = JSON.parse(session.metadata.products);
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
      res.status(200).json({ message: "Order created successfully" ,success:true, orderId: newOrder._id});
    }
  } catch (error) {
    console.log("Error processing checkout", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error:  error.message });
  }
};
