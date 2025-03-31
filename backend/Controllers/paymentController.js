import { model } from "mongoose";
import Coupon from "../Models/couponModel.js";
import {stripe} from "../Config/stripe.js"
import dotenv from "dotenv";
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
              ?[
                  {
                      coupon: await createStripeCoupon(coupon.discountPercentage),
                  },
                  
                  ] : [],
              metadata: {
                  userId: req.user._id,
              },
          })
      } else {
        return res.status(404).json({ message: "Coupon failed" });
      }
    } else {
      totalAmount = Math.round(totalAmount);
    }
  } catch (error) {}
};


const createStripeCoupon = async (discountPercentage) => {
  const stripeCoupon = await stripe.coupons.create({
    duration: "once",
    // duration_in_months: 1,
    percent_off: discountPercentage,
  });
  return stripeCoupon.id;
};