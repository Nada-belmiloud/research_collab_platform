import { useState, useEffect, useCallback } from 'react';
import { projectService, publicationService, cvService, userService } from '../services/api';
import { Project, Publication, StudentCV, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const { user: currentUser, logout: authLogout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [cvList, setCvList] = useState<StudentCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [projectsRes, pubsRes, cvsRes] = await Promise.allSettled([
        projectService.getMyProjects(),
        publicationService.getAll(),
        cvService.getAll(),
      ]);

      setProfile(currentUser as any);

      if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value.data);
      if (pubsRes.status === 'fulfilled') setPublications(pubsRes.value.data);
      if (cvsRes.status === 'fulfilled') setCvList(cvsRes.value.data);
    } catch (err) {
      console.error('Failed to load profile data', err);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleUpdateProfile = async (data: any) => {
    if (!currentUser) return;
    try {
      const res = await userService.updateProfile(currentUser.id, data);
      setProfile(res.data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.detail || 'Update failed' };
    }
  };

  const handleAddProject = async (data: any) => {
    try {
      const res = await projectService.create(data);
      setProjects(prev => [...prev, res.data]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.detail || 'Failed to create project' };
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.detail || 'Delete failed' };
    }
  };

  const handleAddPublication = async (data: any) => {
    try {
        const res = await publicationService.create({
            ...data,
            authors: currentUser ? [{ user_id: currentUser.id, author_order: 1, is_corresponding: true }] : []
        });
        setPublications(prev => [res.data, ...prev]);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.response?.data?.detail || 'Failed to add publication' };
    }
  };

  const handleDeletePublication = async (id: number) => {
    try {
        await publicationService.delete(id);
        setPublications(prev => prev.filter(p => p.id !== id));
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.response?.data?.detail || 'Delete failed' };
    }
  };

  const handleUploadCV = async (data: any) => {
    try {
        const res = await cvService.upload(data);
        setCvList(prev => [res.data, ...prev]);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.response?.data?.detail || 'Upload failed' };
    }
  };

  const handleDeleteCV = async (id: number) => {
    try {
        await cvService.delete(id);
        setCvList(prev => prev.filter(c => c.id !== id));
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.response?.data?.detail || 'Delete failed' };
    }
  };

  return {
    currentUser,
    profile,
    projects,
    publications,
    cvList,
    loading,
    error,
    handleUpdateProfile,
    handleAddProject,
    handleDeleteProject,
    handleAddPublication,
    handleDeletePublication,
    handleUploadCV,
    handleDeleteCV,
    logout: authLogout
  };
};
