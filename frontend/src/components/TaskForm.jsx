import { useState } from 'react';
import { taskService } from '../services/auth';

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await taskService.createTask(title, description);
      setTitle('');
      setDescription('');
      setSuccess('✅ Task created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      onTaskAdded();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>
        <span>➕</span> Add New Task
      </h2>
      
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="form-group">
        <label htmlFor="title" className="form-label">Task Title *</label>
        <input
          id="title"
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="form-label">Description (Optional)</label>
        <textarea
          id="description"
          placeholder="Add more details about your task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
      >
        {loading ? '⏳ Creating...' : '✨ Add Task'}
      </button>
    </form>
  );
}
