import { Link, Route, Routes, Navigate } from 'react-router-dom';
import PredictForm from './components/PredictForm.jsx';
import Auth from './components/Auth.jsx';
import Compare from './components/Compare.jsx';

export default function App() {
  return (
    <div className="container">
      <nav className="nav">
        <div className="brand">CET Predictor</div>
        <div className="links">
          <Link to="/predict">Predict</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/auth">Auth</Link>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/predict" replace />} />
          <Route path="/predict" element={<PredictForm />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
      <footer className="footer">Backend: /api/* → proxied to Node</footer>
    </div>
  );
}


