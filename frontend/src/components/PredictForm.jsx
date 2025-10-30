import { useState } from 'react';
import api from '../lib/api.js';
import axios from 'axios';
export default function PredictForm() {
  const [form, setForm] = useState({ percentile: '', branch: '', caste: '', gender: '', top_n: 5 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults([]);
    try {
      const payload = {
        percentile: Number(form.percentile),
        branch: form.branch,
        caste: form.caste,
        gender: form.gender,
        top_n: Number(form.top_n) || 5,
      };
      const { data } = await axios.post('http://localhost:5001/api/predict', payload);
      setResults(data?.colleges || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  return (
    <div className="card">
      <h2>Predict Colleges</h2>
      <form onSubmit={onSubmit} className="grid">
        <label>
          Percentile
          <input name="percentile" type="number" step="0.01" min="0" max="100" value={form.percentile} onChange={onChange} required />
        </label>
        <label>
          Branch
          <input name="branch" value={form.branch} onChange={onChange} placeholder="Computer Science" required />
        </label>
        <label>
          Caste
          <input name="caste" value={form.caste} onChange={onChange} placeholder="Open" required />
        </label>
        <label>
          Gender
          <input name="gender" value={form.gender} onChange={onChange} placeholder="Male" required />
        </label>
        <label>
          Top N
          <input name="top_n" type="number" min="1" max="100" value={form.top_n} onChange={onChange} />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Predict'}</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="results">
        {results.length > 0 ? (
          <ol>
            {results.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
        ) : (
          !loading && <div className="muted">No results yet</div>
        )}
      </div>
    </div>
  );
}


