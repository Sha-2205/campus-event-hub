import express from 'express';
import {
  getChatHistory,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  getChatStats,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/:teamId/history', protect, getChatHistory);
router.post('/:teamId/send', protect, sendMessage);
router.put('/:teamId/messages/:messageId', protect, editMessage);
router.delete('/:teamId/messages/:messageId', protect, deleteMessage);
router.post('/:teamId/messages/:messageId/react', protect, addReaction);
router.get('/:teamId/stats', protect, getChatStats);

export default router;