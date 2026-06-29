import express from 'express';
import { getMyNotifications, markAsRead } from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all notifications for the authenticated user
router.get('/', protect, getMyNotifications);

// Mark a specific notification as read
router.patch('/:id/read', protect, markAsRead);

export default router;
