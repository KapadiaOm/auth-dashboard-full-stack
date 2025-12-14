import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Sign in to TaskDash</p>
        </div>
        
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '⏳ Signing in...' : '✨ Sign In'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
