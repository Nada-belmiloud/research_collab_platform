import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, Calendar, Target, ChevronLeft, 
  Plus, MoreHorizontal, CheckCircle, Trash2,
  FileText, Send
} from 'lucide-react';

import { useProjectDetails } from '../hooks/useProjectDetails';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    project, loading, tasks, participants,
    isLead, isParticipant, handleApply,
    handleAddTask, handleToggleTask, handleDeleteTask,
    handleUpdateProject
  } = useProjectDetails(id);

  const [isApplying, setIsApplying] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [applicationText, setApplicationText] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', assignee_user_id: '' });
  const [submitting, setSubmitting] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen p-20 text-center bg-brand-cream">
      <h2 className="text-xl font-bold text-brand-navy">Project not found.</h2>
      <Button onClick={() => navigate('/projects')} className="mt-4">Return</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream pb-20">
      <div className="bg-brand-navy pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white/40 hover:text-white mb-8 transition-colors group"
          >
            <ChevronLeft size={16} className="mr-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Library</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <Badge variant="info" className="mb-3">Active Research</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-wider">
                  <Calendar size={14} className="mr-2 text-brand-orange" />
                  {new Date(project.deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-wider">
                  <Users size={14} className="mr-2 text-brand-orange" />
                  {participants.length} Researchers
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isLead && (
                <Button 
                  onClick={() => setShowSettingsModal(true)}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  size="sm"
                >
                  Settings
                </Button>
              )}
              
              {!isLead && !isParticipant && project.accepting_collaborators && (
                <Button 
                  onClick={() => setIsApplying(true)}
                  variant="secondary"
                  size="sm"
                  leftIcon={<Send size={14} />}
                >
                  Join Team
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-8">
              <h2 className="text-sm font-black text-brand-navy/30 uppercase tracking-widest mb-6 flex items-center">
                <FileText size={14} className="mr-2" />
                Objectives
              </h2>
              <p className="text-brand-navy/70 text-sm leading-relaxed font-sans font-light">
                {project.description}
              </p>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-bold text-brand-navy tracking-tight">Milestones</h2>
                {isLead && (
                  <Button 
                    onClick={() => setShowAddTaskModal(true)}
                    variant="ghost"
                    size="sm"
                    leftIcon={<Plus size={14} />}
                  >
                    Add
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {tasks.map((task) => (
                  <Card key={task.id} className="p-4 rounded-xl shadow-none border-brand-navy/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => isLead && handleToggleTask(task)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                            task.status === 'DONE' ? 'bg-brand-orange border-brand-orange text-white' : 'border-brand-navy/10'
                          }`}
                        >
                          {task.status === 'DONE' && <CheckCircle size={12} />}
                        </button>
                        <div>
                          <h4 className={`text-sm font-bold ${task.status === 'DONE' ? 'text-brand-navy/30 line-through' : 'text-brand-navy'}`}>
                            {task.title}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={task.priority === 'HIGH' ? 'error' : task.priority === 'MEDIUM' ? 'warning' : 'success'} className="scale-90">
                          {task.priority}
                        </Badge>
                        {isLead && (
                          <button onClick={() => handleDeleteTask(task.id)} className="text-brand-navy/10 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 bg-brand-navy text-white border-none shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6">Team Registry</h3>
              <div className="space-y-4">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center font-bold text-brand-orange text-xs">
                        {p.user?.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{p.user?.full_name}</p>
                        <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">{p.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy/30 mb-4">Timeline</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                    <div>
                      <p className="text-[10px] font-bold text-brand-navy">Initiated</p>
                      <p className="text-[9px] text-brand-navy/40">{new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-navy/10" />
                    <div>
                      <p className="text-[10px] font-bold text-brand-navy">Deadline</p>
                      <p className="text-[9px] text-brand-navy/40">{new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals Refined */}
      <Modal isOpen={isApplying} onClose={() => setIsApplying(false)} title="Join Research Team">
        <div className="space-y-6">
          <Input 
            label="Motivation"
            textarea
            placeholder="Your background and interests..."
            value={applicationText}
            onChange={(e) => setApplicationText(e.target.value)}
          />
          <Button 
            onClick={async () => {
              setSubmitting(true);
              const res = await handleApply(applicationText);
              if (res.success) setIsApplying(false);
              setSubmitting(false);
            }}
            variant="secondary"
            className="w-full"
            isLoading={submitting}
          >
            Submit
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} title="New Task">
        <div className="space-y-4">
          <Input label="Title" value={taskForm.title} onChange={(e) => setTaskForm({...taskForm, title: e.target.value})} />
          <Input label="Description" textarea value={taskForm.description} onChange={(e) => setTaskForm({...taskForm, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Priority" select options={[{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Med' }, { value: 'HIGH', label: 'High' }]} value={taskForm.priority} onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})} />
            <Input label="Assignee" select options={[{ value: '', label: 'None' }, ...participants.map(p => ({ value: p.user_id.toString(), label: p.user?.full_name || 'User' }))]} value={taskForm.assignee_user_id} onChange={(e) => setTaskForm({...taskForm, assignee_user_id: e.target.value})} />
          </div>
          <Button onClick={async () => { setSubmitting(true); const res = await handleAddTask(taskForm); if (res.success) setShowAddTaskModal(false); setSubmitting(false); }} className="w-full" isLoading={submitting}>Create Milestone</Button>
        </div>
      </Modal>

      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Settings" maxWidth="max-w-md">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-brand-navy/5 rounded-xl">
            <div>
                <p className="text-xs font-bold text-brand-navy">Collaborations</p>
                <p className="text-[9px] text-brand-navy/40 uppercase font-black">Open/Close</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer scale-90">
                <input type="checkbox" className="sr-only peer" checked={project.accepting_collaborators} onChange={(e) => handleUpdateProject({ accepting_collaborators: e.target.checked })} />
                <div className="w-10 h-5 bg-brand-navy/10 rounded-full peer peer-checked:bg-brand-orange transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
          <Input label="Visibility" select options={[{ value: 'PUBLIC', label: 'Public' }, { value: 'PRIVATE', label: 'Private' }]} value={project.visibility} onChange={(e) => handleUpdateProject({ visibility: e.target.value })} />
          <div className="pt-4 border-t border-brand-navy/5">
            <button onClick={() => { if (window.confirm('Archive?')) handleUpdateProject({ status: 'REJECTED' }); }} className="w-full py-3 text-red-500 text-xs font-bold hover:bg-red-50 rounded-xl transition-all">Archive Project</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
