import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { authService } from '../services/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getProfile();
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)' }}>
      <Navbar />
      <div className="max-w-5xl">
        {user && (
          <div className="welcome-card">
            <div className="welcome-card-emoji">👋</div>
            <div>
              <h1 className="welcome-card h1">Welcome, {user.full_name}!</h1>
              <p>{user.email}</p>
            </div>
          </div>
        )}
        
        <TaskForm onTaskAdded={() => setRefresh(!refresh)} />
        <TaskList refresh={refresh} />
      </div>
    </div>
  );
}
