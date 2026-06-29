import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  console.log("Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.slice(7);
  }

  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    req.user = decoded;

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("User found:", user.email);
    user.lastLogin = new Date();
    await user.save();
    console.log("User saved");
    console.log("typeof next =", typeof next);
    console.log("About to call next()");
    next();
  } catch (error) {
  console.error("========== FULL ERROR ==========");
  console.error(error);
  console.error(error.stack);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
}
};