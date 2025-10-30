import { predictAdmission } from '../services/mlService.js';

// Run instructions:
// - Ensure FastAPI is running (see backend/services/python/predictor.py header)
// - Call this controller via POST /api/predict with body:
//   { percentile: number, branch: string, caste: string, gender: string }

export async function predict(req, res) {
  try {
    const { percentile, branch, caste, gender, top_n } = req.body || {};
    if (
      typeof percentile !== 'number' ||
      typeof branch !== 'string' ||
      typeof caste !== 'string' ||
      typeof gender !== 'string'
    ) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const data = await predictAdmission({
      percentile,
      branch,
      caste,
      gender,
      ...(typeof top_n === 'number' ? { top_n } : {}),
    });

    return res.json(data);
  } catch (err) {
    const message = err?.response?.data || err?.message || 'Prediction failed';
    return res.status(500).json({ message });
  }
}

export default { predict };


