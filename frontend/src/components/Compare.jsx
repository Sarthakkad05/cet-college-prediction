import { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function Compare() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/compare');
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <h2>Compare Colleges</h2>
      <button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
      {error && <div className="error">{error}</div>}
      <pre className="muted small" style={{whiteSpace:'pre-wrap'}}>{data ? JSON.stringify(data, null, 2) : 'No data yet'}</pre>
    </div>
  );
}


