import { useState } from 'react';
import api from '../lib/api.js';

export default function Auth() {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const path = mode === 'signup' ? '/auth/signup' : '/auth/signin';
      const { data } = await api.post(path, form);
      setMessage(JSON.stringify(data));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Request failed');
    }
  }

  return (
    <div className="card">
      <h2>Auth</h2>
      <div className="tabs">
        <button className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>Sign In</button>
        <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign Up</button>
      </div>
      <form onSubmit={onSubmit} className="grid">
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </label>
        <button type="submit">{mode === 'signup' ? 'Sign Up' : 'Sign In'}</button>
      </form>
      {error && <div className="error">{error}</div>}
      {message && <pre className="muted small">{message}</pre>}
    </div>
  );
}


