import { Router } from 'express';
import { predict } from '../controllers/predictController.js';

const router = Router();

// POST /api/predict
router.post('/predict', predict);

export default router;


