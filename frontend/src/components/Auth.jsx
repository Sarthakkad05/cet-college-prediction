import { useState } from 'react';
import api from '../lib/api.js';

export default function Auth() {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const path = mode === 'signup' ? '/auth/signup' : '/auth/signin';
      const { data } = await api.post(path, form);
      setMessage(mode === 'signup' 
        ? 'Account created successfully! You can now sign in.' 
        : `Welcome back! ${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>🔐 Authentication</h2>
      <p className="muted" style={{ marginBottom: '1.5rem' }}>
        {mode === 'signin' 
          ? 'Sign in to your account to access your saved predictions and preferences.'
          : 'Create a new account to get started with personalized college predictions.'}
      </p>
      
      <div className="tabs">
        <button 
          className={mode === 'signin' ? 'active' : ''} 
          onClick={() => {
            setMode('signin');
            setError('');
            setMessage('');
          }}
          type="button"
        >
          Sign In
        </button>
        <button 
          className={mode === 'signup' ? 'active' : ''} 
          onClick={() => {
            setMode('signup');
            setError('');
            setMessage('');
          }}
          type="button"
        >
          Sign Up
        </button>
      </div>
      
      <form onSubmit={onSubmit}>
        <div className="grid">
          <label>
            📧 Email Address
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={onChange} 
              placeholder="you@example.com"
              required 
            />
          </label>
          <label>
            🔒 Password
            <input 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={onChange} 
              placeholder="Enter your password"
              required 
            />
          </label>
        </div>
        
        <button type="submit" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
          {loading ? (
            <>
              <span className="loading"></span>
              {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
            </>
          ) : (
            mode === 'signup' ? '✨ Create Account' : '🚀 Sign In'
          )}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      {message && (
        <div className="message" style={{ marginTop: '1rem' }}>
          {message}
        </div>
      )}
    </div>
  );
}


