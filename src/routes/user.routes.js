import express from 'express';
import { getUsersByRole } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", protect, getUsersByRole);

export default router;
