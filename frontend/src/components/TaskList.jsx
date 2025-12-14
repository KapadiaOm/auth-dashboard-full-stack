import { useState, useEffect } from 'react';
import { taskService } from '../services/auth';

export default function TaskList({ refresh }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskService.getTasks(search);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      setError('');
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ));
      setError('');
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleEditTitle = async (taskId) => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }

    try {
      await taskService.updateTask(taskId, { title: editTitle });
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, title: editTitle } : t
      ));
      setEditingId(null);
      setEditTitle('');
      setError('');
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search) {
      fetchTasks();
    }
  }, [search]);

  return (
    <div>
      <div className="card">
        <h2>
          <span>📝</span> Your Tasks
        </h2>
        
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        
        {loading && <div className="loading">Loading tasks...</div>}
        
        {!loading && tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">No tasks yet. Create one to get started!</p>
          </div>
        )}
        
        <div>
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <div style={{ flex: 1 }}>
                  {editingId === task.id ? (
                    <div className="edit-container">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                      />
                      <button
                        onClick={() => handleEditTitle(task.id)}
                        className="btn-success"
                        style={{ width: 'auto' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-secondary"
                        style={{ width: 'auto' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3
                        onClick={() => {
                          setEditingId(task.id);
                          setEditTitle(task.title);
                        }}
                        style={{ cursor: 'pointer', margin: 0 }}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="task-description line-clamp-2">{task.description}</p>
                      )}
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => handleDelete(task.id)}
                  className="btn-danger"
                  style={{ padding: '0.5rem 0.75rem', marginLeft: 'auto' }}
                  title="Delete task"
                >
                  ✕
                </button>
              </div>
              
              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="task-status"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="completed">✅ Completed</option>
                </select>
                
                <span className={`status-badge status-${task.status}`}>
                  {task.status === 'completed' ? '✅ Done' : '⏳ In Progress'}
                </span>

                <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#6b7280' }}>
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
