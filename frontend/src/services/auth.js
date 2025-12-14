import api from './api';

export const authService = {
  register: (email, full_name, password) =>
    api.post('/auth/register', { email, full_name, password }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getProfile: () => api.get('/users/me'),
  
  logout: () => {
    localStorage.removeItem('access_token');
  },

  isAuthenticated: () => !!localStorage.getItem('access_token'),
};

export const taskService = {
  getTasks: (search = '') => {
    if (search) {
      return api.get('/tasks/', { params: { search } });
    }
    return api.get('/tasks/');
  },
  
  createTask: (title, description) =>
    api.post('/tasks/', { title, description }),
  
  updateTask: (id, data) => {
    // Send only fields that are present
    const payload = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.status !== undefined) payload.status = data.status;

    return api.put(`/tasks/${id}`, payload);
  },
  
  deleteTask: (id) =>
    api.delete(`/tasks/${id}`),
};
