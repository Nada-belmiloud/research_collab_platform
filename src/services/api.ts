import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for cookie-based auth
});

// Request interceptor removed as we now rely on HttpOnly cookies

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");

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
  getAll: (params?: { skip?: number, limit?: number, group_id?: number, lab_id?: number, search?: string, status?: string }) =>
  api.get('/projects/', { params }),
  getById: (id: number | string) => api.get(`/projects/${id}`),
  createProject: (data: any) => api.post('/projects/', data),
  updateProject: (id: number, data: any) => api.put(`/projects/${id}`, data),
  deleteProject: (id: number) => api.delete(`/projects/${id}`),
  apply: (projectId: number, cover_letter: string) =>
    api.post('/project-applications/', {
      project_id: projectId,
      cover_letter: cover_letter,
    }),
  getMyProjects: () => api.get('/projects/', { params: { my_projects_only: true } })
};

export const userService = {
  updateProfile: (id: number, data: any) => api.put(`/users/${id}`, data),
  updateProfilePicture: (data: FormData) => api.put('/users/profile-picture', data),
};

export const cvService = {
  getAll: () => api.get('/student-cvs/'),
  upload: (data: FormData) => api.post('/student-cvs/', data),
  delete: (id: number) => api.delete(`/student-cvs/${id}`),
};

export const groupService = {
  getAll: () => api.get('/groups/validated'),
  getById: (id: number | string) => api.get(`/groups/${id}`),
};

export const publicationService = {
  getAll: () => api.get('/publications/'),
  create: (data: any) => api.post('/publications/', data),
  delete: (id: number) => api.delete(`/publications/${id}`),
};

export const teamService = {
  getTeams: () => api.get('/teams/'),

  getTeamById: (id: number) =>
    api.get(`/teams/${id}/summary`),

  createTeam: (data: any) =>
    api.post('/teams/', data),
};

export const applicationService = {
  getMyApplications: () => api.get('/project-applications/mine'),
  getPendingApplications: () => api.get('/project-applications/'),
  getById: (id: number | string) => api.get(`/project-applications/${id}`),
  create: (data: any) => api.post('/project-applications/', data),
  update: (id: number | string, data: any) => api.put(`/project-applications/${id}`, data),
  delete: (id: number | string) => api.delete(`/project-applications/${id}`),
  updateStatus: (id: number | string, status: string) => api.put(`/project-applications/${id}`, { status }),
};

export const landingPageService = {
  getLandingData: () => api.get('/landing-page'),
};

export const taskService = {
  getProjectTasks: (projectId: number) => api.get('/tasks/', { params: { project_id: projectId } }),
  createTask: (data: any) => api.post('/tasks/', data),
  updateTask: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

export const participantService = {
  getProjectParticipants: (projectId: number) => api.get('/project-participants/', { params: { project_id: projectId } }),
};

export const labService = {
  getAll: (skip?: number, limit?: number) => api.get('/labs/', { params: { skip, limit } }),
  getById: (id: number) => api.get(`/labs/${id}`),
};

export default api;