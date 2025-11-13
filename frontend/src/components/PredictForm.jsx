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
      <h2>🎯 Predict Colleges</h2>
      <p className="muted" style={{ marginBottom: '1.5rem' }}>
        Enter your CET details to get personalized college recommendations based on your percentile and preferences.
      </p>
      
      <form onSubmit={onSubmit}>
        <div className="grid">
          <label>
            Percentile
            <input 
              name="percentile" 
              type="number" 
              step="0.01" 
              min="0" 
              max="100" 
              value={form.percentile} 
              onChange={onChange} 
              placeholder="Enter your CET percentile"
              required 
            />
          </label>
          
          <label>
            Branch
            <input 
              name="branch" 
              value={form.branch} 
              onChange={onChange} 
              placeholder="e.g., Computer Science, Mechanical, Civil"
              required 
            />
          </label>
          
          <label>
            Caste Category
            <input 
              name="caste" 
              value={form.caste} 
              onChange={onChange} 
              placeholder="e.g., Open, SC, ST, OBC"
              required 
            />
          </label>
          
          <label>
            Gender
            <select 
              name="gender" 
              value={form.gender} 
              onChange={onChange} 
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          
          <label>
            Number of Results
            <input 
              name="top_n" 
              type="number" 
              min="1" 
              max="50" 
              value={form.top_n} 
              onChange={onChange}
              placeholder="5"
            />
          </label>
        </div>
        
        <button type="submit" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
          {loading ? (
            <>
              <span className="loading"></span>
              Predicting...
            </>
          ) : (
            'Get Predictions'
          )}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {results.length > 0 && (
        <div className="results">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>
            Recommended Colleges ({results.length})
          </h3>
          <ol>
            {results.map((college, i) => (
              <li key={i} style={{ animationDelay: `${i * 0.05}s` }} className="result-item">
                {college}
              </li>
            ))}
          </ol>
        </div>
      )}
      
      {!loading && results.length === 0 && !error && (
        <div className="empty-state">
          Fill in your details above and click "Get Predictions" to see your recommended colleges.
        </div>
      )}
    </div>
  );
}


