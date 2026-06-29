import User from '../models/user.js';
import jwt from 'jsonwebtoken';


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, department, year } =
      req.body;

    
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: ' Passwords do not match',
      });
    }

    
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({
        success: false,
        message: ' Email already registered',
      });
    }

    
    user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      department,
      year: parseInt(year),
    });

    
    const token = generateToken(user._id);

    // Send response
    console.log(` New user registered: ${email}`);
    res.status(201).json({
      success: true,
      message: ' User registered successfully',
      token,
      user: user.getLoginProfile(),
    });
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: ' Please provide email and password',
      });
    }

    
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: ' Invalid credentials',
      });
    }

    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: ' Account is inactive',
      });
    }

    
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: ' Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log(` User logged in: ${email}`);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getLoginProfile(),  
    });
  } catch (error) {
    next(error);
  }
};


export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};


export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: ' Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};