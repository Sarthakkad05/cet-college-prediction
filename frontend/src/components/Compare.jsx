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

  function renderData(data) {
    if (typeof data !== 'object' || data === null) {
      return <div className="muted">{String(data)}</div>;
    }

    if (Array.isArray(data)) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ 
              padding: '1rem', 
              background: 'var(--bg-secondary)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              {typeof item === 'object' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', gap: '0.5rem' }}>
                      <strong style={{ color: 'var(--primary)', minWidth: '150px' }}>{key}:</strong>
                      <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div>{String(item)}</div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ 
            padding: '1rem', 
            background: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <h4 style={{ 
              marginBottom: '0.5rem', 
              color: 'var(--primary)', 
              fontSize: '1rem',
              fontWeight: 600
            }}>
              {key}
            </h4>
            {typeof value === 'object' ? (
              <pre style={{ 
                margin: 0, 
                fontSize: '0.875rem',
                background: 'transparent',
                padding: 0,
                border: 'none'
              }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            ) : (
              <div>{String(value)}</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2>⚖️ Compare Colleges</h2>
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            View and compare college data, statistics, and rankings.
          </p>
        </div>
        <button 
          onClick={load} 
          disabled={loading}
          className="secondary"
          style={{ marginTop: 0 }}
        >
          {loading ? (
            <>
              <span className="loading"></span>
              Loading...
            </>
          ) : (
            '🔄 Refresh'
          )}
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {loading && !data && (
        <div className="empty-state">
          <span className="loading" style={{ margin: '0 auto', display: 'block' }}></span>
          <p style={{ marginTop: '1rem' }}>Loading comparison data...</p>
        </div>
      )}
      
      {!loading && data && (
        <div style={{ marginTop: '1.5rem' }}>
          {renderData(data)}
        </div>
      )}
      
      {!loading && !data && !error && (
        <div className="empty-state">
          No data available. Click refresh to load comparison data.
        </div>
      )}
    </div>
  );
}


