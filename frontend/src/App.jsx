import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PredictForm from './components/PredictForm.jsx';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  );
}

export default function App() {
  return (
    <div className="container">
      <nav className="nav">
        <div className="brand">CET Predictor</div>
        <div className="links">
          <NavLink to="/predict">Predict</NavLink>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/predict" replace />} />
          <Route path="/predict" element={<PredictForm />} />
          <Route path="*" element={
            <div className="card">
              <h2>404 - Page Not Found</h2>
              <p className="muted">The page you're looking for doesn't exist.</p>
              <Link to="/predict">
                <button style={{ marginTop: '1rem' }}>Go to Predict</button>
              </Link>
            </div>
          } />
        </Routes>
      </main>
      <footer className="footer">
        <p>© 2024 CET Predictor | Powered by Machine Learning</p>
        <p className="small muted">Backend: /api/* → proxied to Node</p>
      </footer>
    </div>
  );
}


