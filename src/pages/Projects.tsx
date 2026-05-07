import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api';
import { Project } from '../types';
import { motion } from 'motion/react';
import { Search, Filter, Calendar, Tag, ArrowUpRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAll();
        setProjects(response.data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
  return (
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
});

  return (
    <div className="min-h-screen pb-20 bg-texture pt-12">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-brand-navy mb-6">Research <br /><span className="italic leading-none font-normal">Opportunities</span></h1>
          <p className="text-xl text-brand-navy/60 font-sans max-w-2xl font-light">
            Filter through active research calls, internships, and thesis projects from global research clusters.
          </p>
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
              className="w-full pl-14 pr-6 py-5 bg-white border border-brand-navy/10 rounded-full focus:border-brand-orange outline-none shadow-sm transition-all text-brand-navy font-sans"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-8 py-5 bg-white border border-brand-navy/10 rounded-full text-brand-navy font-bold focus:border-brand-orange outline-none shadow-sm cursor-pointer appearance-none min-w-[200px]"
            >
              <option value="all">All Types</option>
              
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-brand-navy/5 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 hover:border-brand-orange/30 hover:shadow-2xl transition-all cursor-pointer relative flex flex-col justify-between"
              >
                <div className="absolute top-8 right-8">
                  <div className="w-12 h-12 bg-brand-navy/5 rounded-full flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all transform group-hover:rotate-45">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
  <div className="px-3 py-1 bg-brand-navy/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-navy/60">
    {project.visibility}
  </div>

  <div className="px-3 py-1 bg-brand-teal/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-teal">
    {project.status}
  </div>
</div>

                  <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-brand-orange transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-brand-navy/60 text-sm line-clamp-3 mb-6 font-sans leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-brand-navy/5 space-y-3">
                  <div className="flex items-center text-xs text-brand-navy/40 font-bold">
  <GraduationCap className="w-4 h-4 mr-2" />
  <span>Created By: {project.created_by}</span>
</div>
                  <div className="flex items-center text-xs text-brand-navy/40 font-bold font-sans">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
  Created:
  {project.created_at
    ? new Date(project.created_at).toLocaleDateString()
    : '—'}
</span>
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
