import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { groupService } from '../services/api';
import { Team, Project, GroupMember } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Briefcase, Calendar, ChevronLeft, ArrowUpRight, Mail, Globe, Award, Target } from 'lucide-react';

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await groupService.getById(id!);
        setGroup(response.data);
      } catch (err) {
        console.error('Failed to fetch group', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchGroup();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!group) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream text-brand-navy">
      <h2 className="text-3xl font-bold">Research Group not found.</h2>
      <button onClick={() => navigate('/teams')} className="mt-4 text-brand-orange font-bold">Back to teams</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream pb-32">
      {/* Top Banner */}
      <div className="bg-brand-navy pt-24 pb-48 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-orange opacity-5 rounded-bl-full transform translate-x-1/4" />
        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/teams')}
            className="flex items-center text-white/60 hover:text-white mb-10 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Teams</span>
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight max-w-4xl">
              {group.name}
            </h1>
            <p className="text-xl text-white/70 max-w-2xl font-light leading-relaxed mb-10">
              {group.description || "Advancing the frontiers of scientific discovery through collaborative research and innovation."}
            </p>

            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center text-white/70">
                <Users className="w-6 h-6 mr-3 text-brand-orange" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-white/40 mb-1">Team Members</div>
                  <div className="text-lg font-semibold">{group.members?.length || 0} Researchers</div>
                </div>
              </div>
              <div className="flex items-center text-white/70">
                <Target className="w-6 h-6 mr-3 text-brand-orange" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-white/40 mb-1">Active Projects</div>
                  <div className="text-lg font-semibold">{group.projects?.length || 0} Initiatives</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Board / Members */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-brand-navy/5 border border-brand-navy/5"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-brand-navy flex items-center">
                  <Award className="w-8 h-8 mr-4 text-brand-orange" />
                  Research Board
                </h2>
                <span className="bg-brand-orange/10 text-brand-orange px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  Core Team
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {group.members?.map((member, i) => (
                  <motion.div 
                    key={member.user_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center p-6 rounded-2xl bg-brand-cream/30 border border-brand-navy/5 hover:border-brand-orange/20 transition-all group"
                  >
                    <div className="w-14 h-14 bg-brand-navy text-white rounded-full flex items-center justify-center font-bold text-xl mr-5 group-hover:scale-110 transition-transform">
                      {member.user_name?.charAt(0) || "R"}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-brand-navy mb-1">{member.user_name || "Researcher"}</div>
                      <div className="flex items-center text-brand-navy/40 text-xs font-medium">
                        <Mail className="w-3 h-3 mr-2" />
                        {member.user_email || "contact@nexus.edu"}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {!group.members?.length && (
                  <div className="col-span-2 text-center py-12 text-brand-navy/40 italic">
                    No board members listed yet.
                  </div>
                )}
              </div>
            </motion.div>

            {/* Projects Section */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-brand-navy px-4">Current Projects</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {group.projects?.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 hover:border-brand-orange/30 hover:shadow-xl transition-all group cursor-pointer relative"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="absolute top-6 right-6">
                      <ArrowUpRight className="w-5 h-5 text-brand-navy/20 group-hover:text-brand-orange transition-colors" />
                    </div>
                    <div className="px-3 py-1 bg-brand-navy/5 text-brand-navy/60 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block mb-4">
                      {project.visibility}
                    </div>
                    <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-brand-orange transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-brand-navy/60 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex items-center text-[10px] font-bold text-brand-navy/30 uppercase tracking-widest">
                      <Calendar className="w-3 h-3 mr-2" />
                      Created {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
              {!group.projects?.length && (
                <div className="text-center py-20 bg-white/50 rounded-[3rem] border border-dashed border-brand-navy/10">
                  <Briefcase className="w-12 h-12 text-brand-navy/10 mx-auto mb-4" />
                  <p className="text-brand-navy/40 italic">No active projects at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-brand-navy p-10 rounded-[3rem] text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full" />
              <h3 className="text-2xl font-bold mb-8">Group Overview</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-white/10">
                  <span className="text-white/50 text-sm">Founded</span>
                  <span className="font-bold">{new Date(group.created_at).getFullYear()}</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-white/10">
                  <span className="text-white/50 text-sm">Status</span>
                  <span className="text-brand-orange font-bold uppercase text-xs tracking-widest">Validated</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-white/10">
                  <span className="text-white/50 text-sm">Publications</span>
                  <span className="font-bold">12</span>
                </div>
              </div>
              <button className="w-full mt-10 py-4 bg-white text-brand-navy rounded-2xl font-bold text-sm hover:bg-brand-orange hover:text-white transition-all">
                Contact Group Leader
              </button>
            </motion.div>

            <div className="bg-brand-orange/10 p-8 rounded-[2.5rem] border border-brand-orange/20">
              <div className="flex items-center mb-4">
                <Globe className="w-5 h-5 text-brand-orange mr-3" />
                <h4 className="text-lg font-bold text-brand-navy">External Links</h4>
              </div>
              <p className="text-sm text-brand-navy/60 mb-6 font-light">
                Explore our group's official website and external research repositories.
              </p>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-xs font-bold text-brand-navy hover:text-brand-orange transition-all">
                  Official Lab Site <ArrowUpRight className="w-3 h-3 ml-2" />
                </a>
                <a href="#" className="flex items-center text-xs font-bold text-brand-navy hover:text-brand-orange transition-all">
                  GitHub Organization <ArrowUpRight className="w-3 h-3 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
