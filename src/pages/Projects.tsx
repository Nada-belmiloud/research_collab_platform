import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api.ts';
import { Project } from '../types';
import { motion } from 'motion/react';
import { Search, Filter, Calendar, Tag, ArrowUpRight, GraduationCap, Flag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const labId = searchParams.get('lab_id');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await projectService.getAll({
          lab_id: labId ? Number(labId) : undefined
        });
        setProjects(response.data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [labId]);

  const filteredProjects = projects
    .filter((p) =>
      p.visibility === 'PUBLIC' || p.created_by === user?.id
    )
    .filter((p) => {
      return (
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  return (
    <div className="min-h-screen pb-20 bg-texture pt-12">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <h1 className="flex text-4xl md:text-5xl font-sans font-bold text-brand-navy mb-6 tracking-tight">Research <br /><span className="italic leading-none font-normal">Opportunities</span></h1>
          <p className="text-xl text-brand-navy/60 font-sans max-w-2xl font-light">
            Filter through active research calls, internships, and thesis projects from global research clusters.
          </p>
          {labId && (
            <div className="mt-8 flex items-center space-x-4">
              <div className="bg-brand-orange/10 text-brand-orange px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center">
                <Filter className="w-3 h-3 mr-2" />
                Filtering by Laboratory #{labId}
              </div>
              <button
                onClick={() => setSearchParams({})}
                className="text-xs font-bold text-brand-navy/40 hover:text-brand-orange transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/30" />
            <input
              type="text"
              placeholder="Search by field, title, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-3 bg-white border border-brand-navy/10 rounded-full focus:border-brand-orange outline-none shadow-sm transition-all text-brand-navy font-sans"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-8 py-3 bg-white border border-brand-navy/10 rounded-full text-brand-navy font-bold focus:border-brand-orange outline-none shadow-sm cursor-pointer appearance-none min-w-[200px]"
            >
              <option value="all">All Types</option>

            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-brand-navy/5 animate-pulse rounded-[3rem]" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                className="group bg-white p-10 rounded-[3rem] border border-brand-navy/5 hover:border-brand-orange/30 hover:shadow-2xl hover:shadow-brand-navy/10 transition-all cursor-pointer relative flex flex-col justify-between"
              >
                <div className="absolute top-10 right-10">
                  <div className="w-12 h-12 bg-brand-navy/5 rounded-2xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all transform group-hover:rotate-12">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="px-4 py-1.5 bg-brand-navy/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-navy/60 border border-brand-navy/5">
                      {project.visibility}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-5 leading-tight group-hover:text-brand-orange transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-brand-navy/60 text-sm line-clamp-3 mb-8 font-sans leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-8 border-t border-brand-navy/5">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center text-xs font-bold text-brand-navy/50 group-hover:text-brand-navy transition-colors">
                      <GraduationCap className="w-4 h-4 mr-3 text-brand-orange" />
                      <span className="truncate">{project.group_name || 'Individual Research'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs font-bold text-brand-navy/30">
                        <Flag className="w-4 h-4 mr-3 text-brand-orange" />
                        <span>
                          {project.deadline
                            ? new Date(project.deadline).toLocaleDateString()
                            : 'Open Enrollment'}
                        </span>
                      </div>
                      <Link to={`/projects/${project.id}`} className="text-[10px] font-black uppercase tracking-widest text-brand-orange opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>

                <Link to={`/projects/${project.id}`} className="absolute inset-0" />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-brand-navy/20" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No matching projects.</h3>
            <p className="text-brand-navy/40">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
