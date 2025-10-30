import { Router } from 'express';
import { compareColleges } from '../controllers/compareController.js';

const router = Router();

// GET /api/compare
router.get('/compare', compareColleges);

export default router;

