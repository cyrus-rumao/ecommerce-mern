// import UserModel from "../Models/UserModel.js";
import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redis } from "../Config/redis.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  console.log("Access Token: ", accessToken);
  console.log("Reresh Token: ", refreshToken);
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (refreshToken, userId) => {
  try {
    await redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (err) {
    console.log(err);
  }
};

const setCookies = (res, accessToken, refreshToken) => {
  // res.cookie("test", "HelloWorld", { httpOnly: true });
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent xss attacks
    secure: process.env.NODE_ENV === "production" ? true : false, // cannot be accessed by client side scripts it will be tru only if NODE_ENV is production
    sameSite: "strict", //  prevents cross side forgery attack
    maxAge: 15 * 60 * 1000, //minutes*seconds *milliseconds
  }),
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, //prevent xss attacks
      secure: process.env.NODE_ENV === "production" ? true : false, // cannot be accessed by client side scripts it will be tru only if NODE_ENV is production
      sameSite: "strict", //  prevents cross side forgery attack
      maxAge: 7 * 24 * 60 * 60 * 1000, //days*hours*minutes*seconds *milliseconds
    });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // req.body.password = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword }); //stupid mistake
    // newUser.password = await bcrypt.hash(password, 10);

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(refreshToken, user._id);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      password: user.password,
      email: user.email,
      role: user.role,
    });
    // await newUser.save();
  } catch (error) {
    res.status(500).json({ message: "Error in Auth Controller" });
  }
};
// export const login = async (req, res) => {
//   //   const errormsg /= "Invalid credentials";
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (user && (await bcrypt.compare(password, user.password))) {
//       const { accessToken, refreshToken } = generateTokens(user._id);
//       await storeRefreshToken(refreshToken, user._id);
//       setCookies(res, accessToken, refreshToken);
//       return res.status(200).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         message: "Login successful",
//         success: true,
//       });
//     }
//     return res.status(400).json({ message: "Invalid credentials" });
//   } catch (error) {
//     console.log("Error in login Controller", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await User.findOne({ email });

    if (
      !existinguser ||
      !(await bcrypt.compare(password, existinguser.password))
    ) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("Generating Tokens! ❌");
    // Generate access & refresh tokens
    const { accessToken, refreshToken } = generateTokens(existinguser._id);
    console.log("Storing Tokens ❌");
    // await storeRefreshToken(refreshToken, existinguser._id);
    // Set cookies properly
    setCookies(res, accessToken, refreshToken);
    // res.cookie("Hello", "World", { httpOnly: true });
    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        _id: existinguser._id,
        name: existinguser.name,
        email: existinguser.email,
        role: existinguser.role,
      },
    });
  } catch (error) {
    console.error("Error in login Controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logout successful", success: true });
    } else {
      res.status(400).json({ message: "No Refresh Token Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in Logging out" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(400).json({ message: "No Refresh Token Found" });
    }
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
      if (storedToken !== refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production" ? true : false,
        // sameSite: "strict",
        maxAge: 15 * 60 * 100,
      });
      return res
        .status(200)
        .json({ accessToken, message: "Token Refreshed Successfully" });
    }
  } catch (error) {
    console.log("Error in Refreshing Token", error);
    return res.status(500).json({ message: "Error in Refreshing Token" });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
