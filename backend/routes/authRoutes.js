import express from 'express';
import { registerUser, authUser, getUserProfile, toggleSaveDestination } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.post('/save-destination', protect, toggleSaveDestination);

export default router;
