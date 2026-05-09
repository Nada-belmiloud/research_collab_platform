import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { labService } from '../services/api';
import { ResearchLab, Team } from '../types';
import { motion } from 'motion/react';
import { Building, Users, ChevronLeft, ArrowUpRight, Globe, Mail, MapPin, FlaskConical } from 'lucide-react';

const LabDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lab, setLab] = useState<(ResearchLab & { groups?: Team[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        if (id) {
          const response = await labService.getById(Number(id));
          setLab(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch lab details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLab();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full" />
    </div>
  );

  if (!lab) return (
    <div className="min-h-screen p-20 text-center bg-brand-cream">
      <h2 className="text-3xl font-bold text-brand-navy">Laboratory not found.</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-brand-orange font-bold uppercase tracking-widest">Back to Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream pb-32">
      {/* Premium Header */}
      <div className="bg-brand-navy pt-24 pb-48 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-orange opacity-5 rounded-bl-full transform translate-x-1/4" />
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white/60 hover:text-white mb-10 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Return</span>
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                <Building className="w-8 h-8 text-brand-orange" />
              </div>
              <div>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Institutional Profile</span>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none mt-1">
                  {lab.name}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-10 mt-10">
              <div className="flex items-center text-white/70">
                <MapPin className="w-5 h-5 mr-3 text-brand-orange" />
                <span className="text-sm font-medium">{lab.location || 'ENSIA Main Campus'}</span>
              </div>
              <div className="flex items-center text-white/70">
                <Users className="w-5 h-5 mr-3 text-brand-orange" />
                <span className="text-sm font-medium">{lab.groups?.length || 0} Research Groups</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Mission & Vision */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-brand-navy/5 border border-brand-navy/5"
            >
              <h2 className="text-3xl font-bold text-brand-navy mb-8 flex items-center">
                <div className="w-10 h-10 bg-brand-navy/5 rounded-xl flex items-center justify-center mr-4">
                  <FlaskConical className="w-5 h-5 text-brand-navy" />
                </div>
                Mission Statement
              </h2>
              <p className="text-brand-navy/70 text-lg leading-relaxed font-sans font-light">
                {lab.description || 'This laboratory is dedicated to pushing the boundaries of human knowledge through rigorous experimentation, collaborative inquiry, and technological innovation. We foster an environment where elite researchers can thrive and address the most complex challenges of the 21st century.'}
              </p>
            </motion.div>

            {/* Specialized Groups */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-brand-navy px-4">Research Units</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {lab.groups?.map((group, i) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="bg-white p-10 rounded-[3rem] border border-brand-navy/5 hover:border-brand-orange/30 hover:shadow-2xl transition-all group cursor-pointer"
                    onClick={() => navigate(`/teams/${group.id}`)}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-brand-navy/5 rounded-2xl flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                        <Users className="w-6 h-6 text-brand-navy group-hover:text-brand-orange" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-brand-navy/10 group-hover:text-brand-orange transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-brand-navy group-hover:text-brand-orange transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-brand-navy/60 text-sm line-clamp-2 leading-relaxed mb-8">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-brand-navy/5">
                       <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/30">Active Units</span>
                       <span className="text-xs font-bold text-brand-navy">{group.members?.length || 0} Researchers</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              {!lab.groups?.length && (
                <div className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-brand-navy/10">
                  <p className="text-brand-navy/30 italic font-sans">No specialized groups registered under this institution yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-brand-navy p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-8">Institutional Reach</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-white/10">
                  <span className="text-white/50 text-sm">Founded</span>
                  <span className="font-bold">{new Date(lab.created_at).getFullYear()}</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-white/10">
                  <span className="text-white/50 text-sm">Research Groups</span>
                  <span className="text-brand-orange font-bold">{lab.groups?.length || 0}</span>
                </div>
              </div>
              <a 
                href={lab.website_url || '#'}
                className="w-full mt-10 py-4 bg-white text-brand-navy rounded-2xl font-bold text-sm hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span>Institutional Website</span>
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-10 rounded-[3rem] border border-brand-navy/5 shadow-xl"
            >
              <h4 className="text-lg font-bold text-brand-navy mb-8">Administrative Contacts</h4>
              <div className="space-y-6">
                <button className="flex items-center w-full text-brand-navy/40 hover:text-brand-orange transition-colors group">
                  <Mail className="w-5 h-5 mr-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Lab Administration</span>
                </button>
                <button className="flex items-center w-full text-brand-navy/40 hover:text-brand-orange transition-colors group">
                  <Users className="w-5 h-5 mr-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Faculty Directory</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDetails;
