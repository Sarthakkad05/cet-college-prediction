import axios from 'axios';

// Prefer explicit API base via env; fallback to /api (proxied in dev)
const baseURL = import.meta.env.VITE_API_BASE || '/api';

const api = axios.create({ baseURL, timeout: 15000, withCredentials: false });

export default api;


