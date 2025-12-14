import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register(email, fullName, password);
      const loginResponse = await authService.login(email, password);
      localStorage.setItem('access_token', loginResponse.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
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
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Join TaskDash</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Create your account</p>
        </div>
        
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          
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
          
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '⏳ Creating account...' : '✨ Create Account'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#f5576c', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
