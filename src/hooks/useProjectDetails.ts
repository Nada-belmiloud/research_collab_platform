import { useState, useEffect, useCallback } from 'react';
import { projectService, taskService, participantService } from '../services/api';
import { Project, Task, ProjectParticipant } from '../types';
import { useAuth } from '../context/AuthContext';

export const useProjectDetails = (id: string | undefined) => {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [participants, setParticipants] = useState<ProjectParticipant[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await projectService.getById(id);
      setProject(response.data);

      setLoadingTasks(true);
      const tasksRes = await taskService.getProjectTasks(Number(id));
      setTasks(tasksRes.data);
      setLoadingTasks(false);

      setParticipantsLoading(true);
      const participantsRes = await participantService.getProjectParticipants(Number(id));
      setParticipants(participantsRes.data);
      setParticipantsLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch project details', err);
      setError(err.response?.data?.detail || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleApply = async (motivation: string) => {
    if (!id) return;
    try {
      await projectService.apply(Number(id), motivation);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.detail || 'Application failed' };
    }
  };

  const handleAddTask = async (taskData: any) => {
    if (!id) return;
    try {
      const res = await taskService.createTask({ ...taskData, project_id: Number(id) });
      setTasks(prev => [...prev, res.data]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.detail || 'Failed to create task' };
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
      const res = await taskService.updateTask(task.id, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? res.data : t));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleUpdateProject = async (updates: any) => {
    if (!id) return;
    try {
      const res = await projectService.update(Number(id), updates);
      setProject(res.data);
      return { success: true };
    } catch (err) {
      console.error('Failed to update project', err);
      return { success: false };
    }
  };

  const isLead = user && project && (project.created_by === user.id);
  const isParticipant = user && participants.some(p => p.user_id === user.id);

  return {
    project,
    loading,
    tasks,
    participants,
    loadingTasks,
    participantsLoading,
    error,
    user,
    isLead,
    isParticipant,
    handleApply,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateProject,
    refresh: fetchProject
  };
};
