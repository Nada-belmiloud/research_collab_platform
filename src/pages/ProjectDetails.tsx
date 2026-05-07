import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, BookOpen, Target, ChevronLeft, Send, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationText, setApplicationText] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const response = await projectService.getById(id);
          setProject(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch project', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmissionStatus('submitting');
    try {
      if (id) {
        await projectService.apply(id, { coverLetter: applicationText });
        setSubmissionStatus('success');
        setTimeout(() => setIsApplying(false), 3000);
      }
    } catch (err) {
      setSubmissionStatus('error');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen p-20 text-center">
      <h2 className="text-3xl font-bold">Project not found.</h2>
      <button onClick={() => navigate('/projects')} className="mt-4 text-brand-orange">Back to projects</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream pb-32">
      {/* Top Banner */}
      <div className="bg-brand-navy pt-20 pb-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-orange opacity-5 rounded-bl-full" />
        <div className="max-w-4xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center text-white/60 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Library</span>
          </button>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-brand-orange text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter italic">
  {project.visibility}
</span>

<span className="bg-white/10 text-white/80 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
  {project.status}
</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center text-white/70">
              <User className="w-5 h-5 mr-3 text-brand-orange" />
              <div>
                <div className="text-[10px] uppercase font-bold text-white/40">Principal Investigator</div>
                <div className="text-sm font-semibold">
  User #{project.created_by}
</div>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <Calendar className="w-5 h-5 mr-3 text-brand-orange" />
              <div>
                <div className="text-[10px] uppercase font-bold text-white/40">Application Deadline</div>
                <div className="text-sm font-semibold">{project.created_at
  ? new Date(project.created_at).toLocaleDateString()
  : '—'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-brand-navy/5 border border-brand-navy/5">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-brand-navy" />
                Executive Summary
              </h2>
              <p className="text-brand-navy/70 leading-relaxed font-sans font-light">
                {project.description}
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-brand-navy/5 border border-brand-navy/5">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-brand-navy" />
                Technical Requirements
              </h2>
              <ul className="space-y-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-brand-navy/5 border border-brand-navy/5">
  <h2 className="text-2xl font-bold mb-6 flex items-center">
    <Target className="w-6 h-6 mr-3 text-brand-navy" />
    Project Information
  </h2>

  <div className="space-y-4 text-sm text-brand-navy/70">
    <div>
      <span className="font-bold">Visibility:</span>{" "}
      {project.visibility}
    </div>

    <div>
      <span className="font-bold">Status:</span>{" "}
      {project.status}
    </div>

    <div>
      <span className="font-bold">
        Accepting Collaborators:
      </span>{" "}
      {project.accepting_collaborators ? "Yes" : "No"}
    </div>
  </div>
</div>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Application Status</h3>
              <p className="text-sm text-brand-navy/50 mb-8 leading-relaxed">
                Applications for this term are still being accepted. Successful candidates will be contacted for an interview.
              </p>
              
              {!isApplying ? (
                <button 
                  onClick={() => setIsApplying(true)}
                  className="w-full bg-brand-navy text-white text-center py-4 rounded-2xl font-bold hover:bg-brand-orange transition-all shadow-lg shadow-brand-navy/10 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Apply Now</span>
                </button>
              ) : (
                <div className="bg-brand-cream/50 p-4 rounded-2xl border border-brand-navy/10 animate-in fade-in slide-in-from-top-2">
                   <p className="text-xs font-bold text-brand-navy/40 uppercase mb-4">Draft Your Proposal</p>
                   {/* This would be the application form expanded */}
                   <p className="text-[10px] text-brand-orange">Form implementation below</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal Overlay */}
      <AnimatePresence>
        {isApplying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm" onClick={() => setIsApplying(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] p-10 md:p-16 relative shadow-2xl overflow-hidden"
            >
              {submissionStatus === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-4xl font-bold mb-4">Submission Received.</h3>
                  <p className="text-brand-navy/60 font-sans">Your application has been logged in our system. Good luck!</p>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-bold mb-8">Formal Application</h2>
                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Research Intent / Cover Letter</label>
                      <textarea
                        required
                        value={applicationText}
                        onChange={(e) => setApplicationText(e.target.value)}
                        className="w-full px-6 py-6 bg-brand-navy/5 border border-transparent rounded-[2rem] focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm min-h-[200px]"
                        placeholder="Detail your experience, interest in this specific topic, and why you would be a valuable addition to the research team..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setIsApplying(false)}
                        className="flex-1 py-4 text-sm font-bold text-brand-navy/40 hover:text-brand-navy transition-colors"
                      >
                        Discard Draft
                      </button>
                      <button
                        type="submit"
                        disabled={submissionStatus === 'submitting'}
                        className="flex-[2] bg-brand-navy text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl hover:bg-brand-teal transition-all disabled:opacity-50"
                      >
                        {submissionStatus === 'submitting' ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <span>Submit Proposal</span>
                            <ArrowUpRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
              {submissionStatus === 'error' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 flex items-center text-red-600 text-sm rounded-xl">
                  <AlertCircle className="w-5 h-5 mr-3" />
                  Failed to submit application. Please try again later.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
