import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

 
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.slice(7); 
  }

 
  if (!token) {
    return res.status(401).json({
      success: false,
      message: ' Not authorized to access this route',
    });
  }

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

   
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: ' User not found',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: ' Not authorized to access this route',
    });
  }
};