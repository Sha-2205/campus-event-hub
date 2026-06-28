import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getUserRegisteredEvents,
  getEventAttendees,
  cancelEvent,
  getEventStats,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateCreateEvent,
  validateUpdateEvent,
  validateCancelEvent,
} from '../validators/eventValidator.js';

const router = express.Router();


router.get('/', getAllEvents);
router.get('/stats/dashboard', getEventStats);
router.get('/:id', getEventById);
router.get('/:id/attendees', getEventAttendees);


router.post('/create', protect, validateCreateEvent, createEvent);
router.put('/:id', protect, validateUpdateEvent, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/unregister', protect, unregisterFromEvent);
router.post('/:id/cancel', protect, validateCancelEvent, cancelEvent);
router.get('/user/registered', protect, getUserRegisteredEvents);

export default router;