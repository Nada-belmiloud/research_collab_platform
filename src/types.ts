
export type UserRole = "student" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  avatar?: string;
  skills?: string[];
  education?: string[];
  experience?: string[];
  cvUrl?: string;
}

export interface Project {
  title: string;
  authors: string;
}

export interface Lab {
  id: string;
  name: string;
  specialization: string;
  lead: string;
  faculty: string[];
  legacy: string[];
  projects: Project[];
  description: string;
}

export type PostType = "recruitment" | "discussion";

export interface Post {
  id: string;
  type: PostType;
  author: string;
  authorId: string;
  title: string;
  desc: string;
  tags: string[];
  time: string;
  lab?: string;
  labId?: string;
  isPublic: boolean;
  recruitmentType?: "student" | "teacher" | "all";
}

export interface Application {
  id: string;
  postId: string;
  applicantId: string;
  applicantName: string;
  status: "pending" | "accepted" | "rejected";
  time: string;
}
