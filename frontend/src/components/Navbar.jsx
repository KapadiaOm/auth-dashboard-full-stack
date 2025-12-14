import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      navigate('/login');
    }
  };

  return (
    <nav>
      <div>
        <Link to="/" className="logo">
          <span>📋</span>
          <span>TaskDash</span>
        </Link>
        <button onClick={handleLogout} className="navbar-btn">
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}
