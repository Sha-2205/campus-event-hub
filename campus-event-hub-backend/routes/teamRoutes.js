import express from 'express';
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  sendJoinRequest,
  acceptJoinRequest,
  rejectJoinRequest,
  getUserTeams,
  getTeamMembers,
  removeMember,
  findUsersBySkills,
  getTeamStats,
  getPendingRequests,
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateCreateTeam,
  validateUpdateTeam,
  validateJoinRequest,
} from '../validators/teamValidator.js';

const router = express.Router();


router.get('/', getAllTeams);
router.get('/stats/dashboard', getTeamStats);
router.get('/find-users/by-skills', findUsersBySkills);
router.get('/:id', getTeamById);
router.get('/:id/members', getTeamMembers);


router.post('/create', protect, validateCreateTeam, createTeam);
router.put('/:id', protect, validateUpdateTeam, updateTeam);
router.delete('/:id', protect, deleteTeam);
router.post('/:id/request-join', protect, validateJoinRequest, sendJoinRequest);
router.post('/:teamId/accept-request/:userId', protect, acceptJoinRequest);
router.post('/:teamId/reject-request/:userId', protect, rejectJoinRequest);
router.get('/user/my-teams', protect, getUserTeams);
router.delete('/:teamId/members/:userId', protect, removeMember);
router.get('/:id/pending-requests', protect, getPendingRequests);

export default router;