import axios from 'axios';

// Existing function kept for compatibility (uses env-configured URL)
export async function predictCollege(payload) {
  const url = process.env.ML_API_URL;
  if (!url) {
    throw new Error('ML_API_URL is not configured');
  }
  const response = await axios.post(url, payload, { timeout: 10000 });
  return response.data;
}

// New function calling local FastAPI by default
// If ML_API_URL is provided, it will override the default
export async function predictAdmission(payload) {
  const url = process.env.ML_API_URL || 'http://127.0.0.1:5000/predict';
  const response = await axios.post(url, payload, { timeout: 10000 });
  return response.data;
}

export default { predictCollege, predictAdmission };

