export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PARTNER';
  institution?: string;
  department?: string;
  profile_picture_url?: string;
  bio?: string;
  created_at: string;
  phone_number?: string;
  address?: string;
  website?: string;
  contact_email?: string;
}

export type UserProfile = User;

export interface StudentProfile {
  id: number;
  user_id: number;
  university: string;
  level: 'PHD' | 'MASTERS' | 'BACHELORS' | 'POSTDOC';
  major: string;
  bio: string;
  experience: string;
  research_interests: string;
  skills: string;
  cv_url?: string;
}

export type StudentCV = StudentProfile;

export interface TeacherProfile {
  id: number;
  user_id: number;
  experience_years: number;
  grade: string;
  department: string;
  research_interests: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  created_by: number;
  created_by_name?: string;
  group_id: number | null;
  visibility: 'PUBLIC' | 'PRIVATE';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  accepting_collaborators: boolean;
  created_at: string;
  deadline?: string;
  group_name?: string;
  decision_note?: string;
}

export interface Application {
  id: number;
  project_id: number;
  applicant_user_id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
  cover_letter: string;
  reviewed_by?: number;
  decision_note?: string;
  // Computed fields for UI convenience
  projectTitle?: string;
  studentName?: string;
}

export interface Publication {
  id: number;
  title: string;
  abstract: string;
  publication_date: string;
  venue: string;
  doi?: string;
  paper_url?: string;
  citation_count: number;
  created_at: string;
}

export interface CollaborationCall {
  id: number;
  title: string;
  description: string;
  created_by: number;
  created_at: string;
}

export interface GroupMember {
  group_id: number;
  user_id: number;
  is_active: boolean;
  joined_at: string;
  user_name?: string;
  user_email?: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  created_at: string;
  projects?: Project[];
  members?: GroupMember[];
}

export interface ResearchLab {
  id: number;
  name: string;
  description: string;
  location?: string;
  website_url?: string;
  created_at: string;
  groups?: Team[];
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_by?: number;
  assignee_user_id?: number;
  assignee_name?: string;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProjectParticipant {
  id: number;
  project_id: number;
  user_id: number;
  user_name?: string;
  participant_role: 'LEAD' | 'MEMBER' | 'REVIEWER';
  joined_at: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  full_name: string;
  password?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  content: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unread_count: number;
}

export interface UserSettings {
  id: number;
  user_id: number;
  email_notifications: boolean;
  app_notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export interface ActivityDatapoint {
  date: string;
  count: number;
}

export interface SystemStats {
  total_users: number;
  total_labs: number;
  total_projects: number;
  total_publications: number;
  total_applications: number;
  pending_applications: number;
}

export interface AnalyticsResponse {
  stats: SystemStats;
  user_growth: ActivityDatapoint[];
  application_trends: ActivityDatapoint[];
}
