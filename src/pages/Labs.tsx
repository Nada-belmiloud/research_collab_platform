import React, { useState, useEffect } from 'react';
import { labService } from '../services/api';
import { ResearchLab } from '../types';
import { motion } from 'motion/react';
import { FlaskConical, Globe, MapPin, Search, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Labs: React.FC = () => {
  const [labs, setLabs] = useState<ResearchLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await labService.getAll();
        setLabs(res.data);
      } catch (err) {
        console.error('Failed to fetch labs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-cream/30 p-8 md:p-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <h1 className="flex gap-2 text-4xl md:text-5xl font-serif text-brand-navy leading-tight tracking-tight">
                Our Research <br /> <span className="italic text-brand-teal">Institutions.</span>
              </h1>
            </div>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/20" />
              <input
                type="text"
                placeholder="Search labs by name or focus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white rounded-[2rem] border-none shadow-xl shadow-brand-navy/5 outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all font-sans"
              />
            </div>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-brand-orange animate-spin mb-4" />
            <p className="text-brand-navy/40 font-sans italic">Assembling the directory...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab, index) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-[3rem] p-10 border border-brand-navy/5 hover:border-brand-orange/20 hover:shadow-2xl hover:shadow-brand-navy/5 transition-all"
                >
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-brand-navy/5 rounded-2.5xl flex items-center justify-center text-brand-navy group-hover:bg-brand-orange group-hover:text-white transition-all mb-6">
                      <FlaskConical className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-navy mb-3 group-hover:text-brand-orange transition-colors">
                      {lab.name}
                    </h3>
                    <p className="text-sm text-brand-navy/50 line-clamp-3 font-sans leading-relaxed">
                      {lab.description}
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-brand-navy/5 pt-8 mb-8">
                    {lab.location && (
                      <div className="flex items-center text-brand-navy/40 space-x-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">{lab.location}</span>
                      </div>
                    )}
                    {lab.website_url && (
                      <a
                        href={lab.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-brand-teal hover:text-brand-orange transition-colors space-x-3"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Visit Laboratory</span>
                      </a>
                    )}
                  </div>

                  <Link
                    to={`/projects?lab_id=${lab.id}`}
                    className="flex items-center justify-between w-full py-4 px-8 bg-brand-navy text-white rounded-2xl font-bold group-hover:bg-brand-orange transition-all active:scale-95 shadow-lg shadow-brand-navy/10"
                  >
                    <span>View Projects</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white/50 rounded-[3rem] border-2 border-dashed border-brand-navy/10">
                <p className="text-brand-navy/30 italic font-serif text-2xl">No laboratories match your query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Labs;
