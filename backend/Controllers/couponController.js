import Coupon from "../Models/couponModel.js";
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
      // code:code,
    });
    if (!coupon) {
      return res.status(404).json({ message: "No active coupon found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    console.log("Error in getCoupon");
    res.status(500).json({ message: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  // console.log("YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
  console.log("Validating coupon");
  try {
    const { code } = req.body;
    console.log("Code: ", req.body.code);
    const coupon = await Coupon.findOne({
      code: code,
      isActive: true,
    });
    if (!coupon) {
      console.log("Code Not Found");
      return res.status(404).json({ message: "Coupon not found" });
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }
    res.json({
      message: "Coupon validated successfully",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon");
    res.status(500).json({ message: error.message });
  }
};
