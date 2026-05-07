export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'STUDENT' | 'PROFESSOR' | 'DOCTOR' | 'RESEARCHER' | 'MCA';
  institution?: string;
  bio?: string;
}

export interface StudentProfile {
  university: string;
  level: 'UNDERGRADUATE' | 'GRADUATE' | 'PHD';
  major: string;
  bio: string;
  experience: string;
  research_interests: string;
  skills: string;
  cv_url?: string;
}

export interface TeacherProfile {
  experience_years: number;
  grade: string;
  department: string;
  research_interests: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  field: string;
  requirements: string[];
  deadline: string;
  status: 'open' | 'closed';
  type: 'research' | 'internship' | 'thesis';
}

export interface Application {
  id: string;
  projectId: string;
  projectTitle: string;
  studentId: string;
  studentName: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  coverLetter: string;
}

export interface CollaborationCall {
  id: string;
  title: string;
  description: string;
  organizer: string;
  tags: string[];
  date: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  tags: string[];
}
