import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  signup: (data: any) => api.post('/auth/signup', data),
  getProfile: () => api.get('/auth/profile'),
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  createProject: (data: any) => api.post('/projects/', data),
  apply: (projectId: string, data: any) =>
  api.post(`/projects/${projectId}/apply`, data),
  getMyProjects: () =>
  api.get('/projects/', {
    params: {
      skip: 0,
      limit: 100,
    }
  })
};

export const teamService = {
  getTeams: () => api.get('/teams'),
};

export const applicationService = {
  getMyApplications: () => api.get('/applications/my'),
  getPendingApplications: () => api.get('/applications/pending'), // for teachers
  updateStatus: (id: string, status: 'approved' | 'rejected') => 
    api.patch(`/applications/${id}`, { status }),
};

export default api;
