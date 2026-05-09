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
  getAll: (params?: any) =>
  api.get('/projects/', { params }),
  getById: (id: string) => api.get(`/projects/${id}/`),
  createProject: (data: any) => api.post('/projects/', data),
  apply: (projectId: number, motivation: string) =>
  api.post('/project-applications/', {
    project_id: projectId,
    motivation: motivation,
    applicant_user_id: JSON.parse(localStorage.getItem("user") || "{}")?.id
  }),
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
  getMyApplications: () => api.get('/project-applications/mine'),

  getPendingApplications: () => api.get('/project-applications/'),

  getById: (id: string) => api.get(`/project-applications/${id}`),

  create: (data: any) => api.post('/project-applications/', data),

  update: (id: string, data: any) =>
    api.put(`/project-applications/${id}`, data),

  delete: (id: string) =>
    api.delete(`/project-applications/${id}`),

  updateStatus: (id: string, status: string) =>
  api.put(`/project-applications/${id}`, {
    status,
  }),
};

export default api;
