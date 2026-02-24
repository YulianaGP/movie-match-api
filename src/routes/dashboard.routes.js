import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller.js';

const router = Router();

// GET /api/dashboard — Comprehensive statistics
router.get('/', getStats);

export default router;
