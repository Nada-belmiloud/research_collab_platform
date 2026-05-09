import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService, taskService, participantService } from '../services/api';
import { Project, Task, ProjectParticipant } from '../types';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Target, 
  ChevronLeft, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Trash2, 
  Users, 
  Flag,
  Plus,
  Mail,
  MoreHorizontal
} from 'lucide-react';


const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [participants, setParticipants] = useState<ProjectParticipant[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  
  const [isApplying, setIsApplying] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', assignee_user_id: '' as string | number });
  const [applicationText, setApplicationText] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [taskSubmitting, setTaskSubmitting] = useState(false);

  const isLead = user && project && (project.created_by === user.id);
  const isParticipant = user && participants.some(p => p.user_id === user.id);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const response = await projectService.getById(id);
          setProject(response.data);

          setLoadingTasks(true);
          const tasksRes = await taskService.getProjectTasks(Number(id));
          setTasks(tasksRes.data);
          setLoadingTasks(false);

          setParticipantsLoading(true);
          const partRes = await participantService.getProjectParticipants(Number(id));
          setParticipants(partRes.data);
          setParticipantsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch project data', err);
      } finally {
        setLoading(false);
        setLoadingTasks(false);
        setParticipantsLoading(false);
      }
    };

    fetchProject();
  }, [id, user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmissionStatus('submitting');
    try {
      await projectService.apply(Number(id), applicationText);
      setSubmissionStatus('success');
      setTimeout(() => {
        setIsApplying(false);
        setSubmissionStatus('idle');
        setApplicationText('');
      }, 2000);
    } catch (err: any) {
      setSubmissionStatus('error');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !taskForm.title) return;
    try {
      setTaskSubmitting(true);
      const res = await taskService.createTask({
        ...taskForm,
        project_id: Number(id),
        assignee_user_id: taskForm.assignee_user_id ? Number(taskForm.assignee_user_id) : null
      });
      setTasks(prev => [...prev, res.data]);
      setShowAddTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', assignee_user_id: '' });
    } catch (err) {
      console.error('Failed to create task', err);
    } finally {
      setTaskSubmitting(false);
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
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen p-20 text-center bg-brand-cream">
      <h2 className="text-3xl font-bold text-brand-navy">Project not found.</h2>
      <button onClick={() => navigate('/projects')} className="mt-4 text-brand-orange font-bold uppercase tracking-widest">Back to library</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream pb-32">
      {/* Immersive Header */}
      <div className="bg-brand-navy pt-24 pb-48 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-orange opacity-5 rounded-bl-full transform translate-x-1/4" />
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center text-white/60 hover:text-white mb-10 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Library</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-brand-orange text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-orange/20">
                  {project.visibility}
                </span>
                <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
                  Ref: #PRJ-{project.id}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                {project.title}
              </h1>

              <div className="flex flex-wrap gap-10">
                <Link 
                  to={project.group_id ? `/teams/${project.group_id}` : '#'}
                  className="flex items-center text-white/70 hover:text-brand-orange transition-all group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-brand-orange/20 transition-all border border-white/5">
                    <Users className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-white/40 mb-1">Research Group</div>
                    <div className="text-sm font-semibold flex items-center">
                      {project.group_name || 'Individual Project'}
                      {project.group_id && <ArrowUpRight className="w-3 h-3 ml-2 opacity-40 group-hover:opacity-100 transition-opacity" />}
                    </div>
                  </div>
                </Link>
                <div className="flex items-center text-white/70">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mr-4 border border-white/5">
                    <Flag className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-white/40 mb-1">Project Deadline</div>
                    <div className="text-sm font-semibold">
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : 'Open Enrollment'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {isLead && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-brand-navy px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all border border-brand-navy/5 flex items-center space-x-2"
              >
                <MoreHorizontal className="w-5 h-5" />
                <span>Project Settings</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Project Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-brand-navy/5 border border-brand-navy/5"
            >
              <h2 className="text-2xl font-bold text-brand-navy mb-8 flex items-center">
                <div className="w-10 h-10 bg-brand-navy/5 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-5 h-5 text-brand-navy" />
                </div>
                Executive Summary
              </h2>
              <div className="prose prose-brand max-w-none">
                <p className="text-brand-navy/70 text-lg leading-relaxed font-sans font-light">
                  {project.description}
                </p>
              </div>

              {/* Meta Info */}
              <div className="mt-12 pt-8 border-t border-brand-navy/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center text-[10px] font-bold text-brand-navy/30 uppercase tracking-widest">
                    <Calendar className="w-4 h-4 mr-2" />
                    Published {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                {project.accepting_collaborators && (
                  <div className="flex items-center text-brand-orange">
                    <div className="w-2 h-2 bg-brand-orange rounded-full mr-2 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Seeking Research Partners</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Strategic Roadmap */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-brand-navy/5 border border-brand-navy/5"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-bold text-brand-navy flex items-center">
                  <div className="w-10 h-10 bg-brand-navy/5 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircle2 className="w-5 h-5 text-brand-navy" />
                  </div>
                  Project Roadmap
                </h2>
                {isLead && (
                  <button 
                    onClick={() => setShowAddTaskModal(true)}
                    className="p-3 bg-brand-navy text-white rounded-xl hover:bg-brand-orange transition-all shadow-lg active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>

              {loadingTasks ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-brand-navy/5 animate-pulse rounded-2xl" />)}
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-brand-navy/5">
                  {tasks.map((task, i) => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      className="relative pl-14 group"
                    >
                      <button 
                        onClick={() => isLead && handleToggleTask(task)}
                        className={`absolute left-4 top-2 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 transition-all ${
                          task.status === 'DONE' ? 'bg-green-500 scale-110' : 
                          task.status === 'IN_PROGRESS' ? 'bg-brand-orange' : 'bg-brand-navy/10'
                        }`} 
                      />
                      
                      <div className="bg-brand-cream/20 p-6 rounded-2xl border border-brand-navy/5 group-hover:border-brand-orange/20 group-hover:bg-white group-hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-4">
                            <h4 className={`text-sm font-bold mb-1 ${task.status === 'DONE' ? 'text-brand-navy/30 line-through' : 'text-brand-navy'}`}>
                              {task.title}
                            </h4>
                            <p className="text-xs text-brand-navy/50 font-sans line-clamp-1">{task.description}</p>
                            <div className="mt-3 flex items-center gap-3">
                              <span className="text-[10px] text-brand-navy/40 font-bold uppercase tracking-widest">
                                Assigned to: {task.assignee_name || 'Unassigned'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                              task.priority === 'HIGH' || task.priority === 'URGENT' ? 'bg-red-50 text-red-500' : 
                              task.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-500' : 'bg-brand-navy/5 text-brand-navy/30'
                            }`}>
                              {task.priority}
                            </span>
                            {isLead && (
                              <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 text-brand-navy/10 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-brand-navy/5 rounded-3xl ml-14">
                      <p className="text-sm text-brand-navy/20 italic font-sans">Project roadmap has not been populated yet.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* CTA Section */}
            {!isLead && !isParticipant && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-brand-navy p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-brand-navy/20"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 -mr-16 -mt-16 rounded-full blur-2xl" />
                <h3 className="text-2xl font-bold mb-4">Start Collaborating</h3>
                <p className="text-white/50 text-sm mb-10 font-light leading-relaxed">
                  Join the mission to advance this research. Apply now with your CV and a brief statement of interest.
                </p>
                <button 
                  onClick={() => setIsApplying(true)}
                  disabled={!project.accepting_collaborators}
                  className={`w-full py-5 rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center justify-center space-x-2 ${
                    project.accepting_collaborators 
                    ? 'bg-brand-orange text-white hover:bg-brand-orange/90 active:scale-95' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{project.accepting_collaborators ? 'Apply to Project' : 'Closed for Apps'}</span>
                </button>
              </motion.div>
            )}

            {/* Participants Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-10 rounded-[3rem] border border-brand-navy/5 shadow-xl shadow-brand-navy/5"
            >
              <h4 className="text-lg font-bold text-brand-navy mb-8 flex items-center justify-between">
                Active Board
                <span className="text-[10px] font-black bg-brand-navy/5 px-2 py-0.5 rounded-md text-brand-navy/30">{participants.length}</span>
              </h4>
              
              {participantsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-12 bg-brand-navy/5 animate-pulse rounded-2xl" />)}
                </div>
              ) : (
                <div className="space-y-6">
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center group">
                      <div className="w-10 h-10 bg-brand-navy text-white rounded-full flex items-center justify-center font-bold text-xs mr-4 group-hover:bg-brand-orange transition-colors shadow-lg shadow-brand-navy/10">
                        {p.user_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-brand-navy leading-none mb-1">{p.user_name}</div>
                        <div className="text-[9px] text-brand-navy/40 font-black uppercase tracking-widest">{p.participant_role}</div>
                      </div>
                    </div>
                  ))}
                  {participants.length === 0 && (
                    <div className="text-sm text-brand-navy/30 italic font-sans py-4">
                      No board members listed.
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-10 pt-10 border-t border-brand-navy/5 space-y-4">
                <button className="flex items-center w-full text-brand-navy/40 hover:text-brand-orange transition-colors text-left group">
                  <Mail className="w-4 h-4 mr-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Inquire with Faculty</span>
                </button>
                <button className="flex items-center w-full text-brand-navy/40 hover:text-brand-orange transition-colors text-left group">
                  <AlertCircle className="w-4 h-4 mr-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Project Report</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isApplying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          >
            <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md" onClick={() => setIsApplying(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] p-12 md:p-16 relative shadow-2xl overflow-hidden border border-white/20"
            >
              {submissionStatus === 'success' ? (
                <div className="text-center py-10">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <h3 className="text-4xl font-bold text-brand-navy mb-4 leading-tight">Proposal Sent Successfully.</h3>
                  <p className="text-brand-navy/60 text-lg font-light font-sans max-w-sm mx-auto">The project lead will review your profile and get back to you soon.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-brand-navy mb-8 tracking-tight">Send Proposal</h2>
                  <form onSubmit={handleApply} className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-navy/40 ml-1">Candidate Statement</label>
                      <textarea
                        required
                        value={applicationText}
                        onChange={(e) => setApplicationText(e.target.value)}
                        className="w-full px-8 py-8 bg-brand-navy/5 border-2 border-transparent rounded-[2.5rem] focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm min-h-[220px] shadow-inner"
                        placeholder="Explain your relevant experience and why you're interested in this research path..."
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsApplying(false)}
                        className="text-sm font-bold text-brand-navy/30 hover:text-brand-navy transition-colors px-4"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submissionStatus === 'submitting'}
                        className="flex-1 bg-brand-navy text-white py-5 rounded-[1.5rem] font-bold flex items-center justify-center space-x-3 shadow-2xl hover:bg-brand-teal transition-all disabled:opacity-50"
                      >
                        {submissionStatus === 'submitting' ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Submit Application</span>
                            <ArrowUpRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddTaskModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddTaskModal(false)}
              className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl border border-white/20"
            >
              <h3 className="text-3xl font-bold text-brand-navy mb-8 tracking-tight">Create Milestone</h3>
              <form onSubmit={handleAddTask} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-3 block ml-1">Task Title</label>
                  <input 
                    type="text" required value={taskForm.title}
                    onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-brand-navy/5 border-2 border-transparent focus:border-brand-orange focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="e.g., Experimental Validation"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-3 block ml-1">Brief Description</label>
                  <textarea 
                    value={taskForm.description}
                    onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-brand-navy/5 border-2 border-transparent focus:border-brand-orange focus:bg-white outline-none transition-all h-28 resize-none shadow-inner"
                    placeholder="What needs to be achieved?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-3 block ml-1">Priority</label>
                    <select 
                      value={taskForm.priority}
                      onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                      className="w-full px-4 py-4 rounded-2xl bg-brand-navy/5 border-2 border-transparent outline-none focus:border-brand-orange transition-all appearance-none cursor-pointer"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-3 block ml-1">Assignee</label>
                    <select 
                      value={taskForm.assignee_user_id}
                      onChange={e => setTaskForm({...taskForm, assignee_user_id: e.target.value})}
                      className="w-full px-4 py-4 rounded-2xl bg-brand-navy/5 border-2 border-transparent outline-none focus:border-brand-orange transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Unassigned</option>
                      {participants.map(p => (
                        <option key={p.user_id} value={p.user_id}>{p.user_name || `User #${p.user_id}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit" disabled={taskSubmitting}
                    className="flex-1 bg-brand-navy text-white py-4 rounded-2xl font-bold hover:bg-brand-orange transition-all shadow-xl disabled:opacity-50"
                  >
                    {taskSubmitting ? 'Syncing...' : 'Add Milestone'}
                  </button>
                  <button 
                    type="button" onClick={() => setShowAddTaskModal(false)}
                    className="px-8 py-4 rounded-2xl font-bold text-brand-navy/30 hover:bg-brand-navy/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
