import express from 'express';
import {
  getUserProfile,
  getMyProfile,
  updateProfile,
  updateSkills,
  updateInterests,
  getAllUsers,
  searchBySkills,
  getUserStats,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateUpdateProfile,
  validateAddSkills,
  validateAddInterests,
} from '../validators/profileValidator.js';

const router = express.Router();

router.get('/users/all', getAllUsers);
router.get('/search/skills', searchBySkills);
router.get('/stats', getUserStats);

router.get('/me/profile', protect, getMyProfile);
router.put('/update', protect, validateUpdateProfile, updateProfile);
router.put('/skills', protect, validateAddSkills, updateSkills);
router.put('/interests', protect, validateAddInterests, updateInterests);

// Keep this LAST
router.get('/:id', getUserProfile);

export default router;