import Product from "../Models/productModel.js";
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = req.user;

    if (!user)
      return res.status(401).json({ message: "User not authenticated" });

    const existingItem = user.cartItems.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({ product: productId, quantity });
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart:", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      // user.cartItems = user.cartItems.filter(
      //   (item) => !item.productId.equals(productId)
      // );
      user.cartItems = user.cartItems.filter(
        (item) => item?.product?.toString() !== productId.toString()
      );
      //item has product and quantity field not the productId fiels. So we find first the product and then its id
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in removeAllFromCart");
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = req.user;

    if (!user?.cartItems?.length) {
      return res.status(200).json([]);
    }

    const cartItems = user.cartItems.filter((item) => item?.product);

    const productIds = cartItems.map((item) => item.product);

    const products = await Product.find({ _id: { $in: productIds } });

    const detailedCart = products.map((product) => {
      const cartItem = cartItems.find(
        (item) => item?.product?.toString?.() === product?._id?.toString?.()
      );

      return {
        ...product.toJSON(),
        quantity: cartItem?.quantity || 1,
      };
    });

    res.json(detailedCart);
  } catch (error) {
    console.error("💥 Error in getCart:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) =>
      item?.product?.toString() === productId.toString()
    );
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item?.product?.toString() !== productId.toString()
        );
        await user.save();
        return res.json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in updateQuantity");
    res.status(500).json({ message: error.message });
  }
};
