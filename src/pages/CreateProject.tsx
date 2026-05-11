import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Target, Calendar, Eye, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { projectService } from '../services/api';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
    deadline: '',
    accepting_collaborators: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await projectService.create(formData);
      navigate('/projects');
    } catch (err: any) {
      console.error('Failed to create project', err);
      setError(err.response?.data?.detail || 'Something went wrong while creating the project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream pb-24 pt-12">
      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center text-brand-navy/40 hover:text-brand-navy mb-12 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Cancel and Return</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl border border-brand-navy/5"
        >
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-brand-navy mb-4 tracking-tight">Initiate New <br /><span className="italic leading-none font-normal">Research Project</span></h1>
            <p className="text-brand-navy/50 font-light max-w-lg">Define your research objectives, set timelines, and choose your collaboration preferences.</p>
          </header>

          {error && (
            <div className="mb-8 p-6 bg-red-50 text-red-600 rounded-2xl flex items-center gap-4 text-sm font-medium border border-red-100">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Title Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-1">Project Title</label>
              <div className="relative">
                <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20 w-5 h-5" />
                <input
                  required
                  type="text"
                  placeholder="e.g., Quantum Neural Networks for Image Synthesis"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-14 pr-8 py-5 bg-brand-navy/5 border-2 border-transparent rounded-2xl focus:border-brand-orange focus:bg-white outline-none transition-all text-lg font-bold text-brand-navy placeholder:text-brand-navy/20"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-1">Abstract & Objectives</label>
              <textarea
                required
                placeholder="Describe the research goals, methodology, and expected outcomes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-8 bg-brand-navy/5 border-2 border-transparent rounded-[2rem] focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-brand-navy/70 min-h-[200px] leading-relaxed"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Visibility */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-1">Access Protocol</label>
                <div className="flex p-1.5 bg-brand-navy/5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'PUBLIC' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${
                      formData.visibility === 'PUBLIC' ? 'bg-white text-brand-navy shadow-md' : 'text-brand-navy/40 hover:text-brand-navy'
                    }`}
                  >
                    <Eye size={14} /> Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'PRIVATE' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${
                      formData.visibility === 'PRIVATE' ? 'bg-white text-brand-navy shadow-md' : 'text-brand-navy/40 hover:text-brand-navy'
                    }`}
                  >
                    <Users size={14} /> Private
                  </button>
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-1">Target Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20 w-5 h-5" />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full pl-14 pr-8 py-4 bg-brand-navy/5 border-2 border-transparent rounded-2xl focus:border-brand-orange focus:bg-white outline-none transition-all font-bold text-brand-navy"
                  />
                </div>
              </div>
            </div>

            {/* Collaboration Toggle */}
            <div className="flex items-center justify-between p-8 bg-brand-navy/5 rounded-[2rem] border border-brand-navy/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm">
                  <Users size={24} />
                </div>
                <div>
                  <p className="font-bold text-brand-navy">Accept Collaborators</p>
                  <p className="text-xs text-brand-navy/40">Allow other researchers to apply for this project.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.accepting_collaborators}
                  onChange={(e) => setFormData({ ...formData, accepting_collaborators: e.target.checked })}
                />
                <div className="w-14 h-8 bg-brand-navy/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-orange shadow-inner"></div>
              </label>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-6 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand-navy text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 shadow-2xl shadow-brand-navy/20 hover:bg-brand-orange transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Launch Research Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateProject;
