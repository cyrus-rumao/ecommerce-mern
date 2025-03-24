import Product from "../Models/productModel.js";
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) =>
      item.product.productId.equals(productId)
    );
    if (existingItem) {
      existingItem.quantity++;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addTOCart");
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
      user.cartItems = user.cartItems.filter(
        (item) => !item.productId.equals(productId)
      );
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
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product._id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
      res.json(cartItems);
  } catch (error) {
    console.log("Error in getCart");
    res.status(500).json({ message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) =>
      item.product.productId.equals(productId)
    );
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => !item.productId.equals(productId)
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
