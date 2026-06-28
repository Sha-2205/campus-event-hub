import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
} from '../validators/authValidator.js';

const router = express.Router();


router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);


router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;