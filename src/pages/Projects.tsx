import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api';
import { Project } from '../types';
import { motion } from 'motion/react';
import { Search, GraduationCap, Flag, Plus, ArrowRight } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchParams] = useSearchParams();
  const labId = searchParams.get('lab_id');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    .filter((p) => p.visibility === 'PUBLIC' || p.created_by === user?.id)
    .filter((p) => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen pb-12 bg-texture pt-10">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-12 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-bold text-brand-navy tracking-tight">
              Research <span className="text-brand-orange italic font-normal text-3xl">Library</span>
            </h1>
            <p className="text-sm md:text-base text-brand-navy/60 font-sans max-w-xl font-light mt-2">
              Explore active research calls and thesis projects from ENSIA clusters.
            </p>
          </div>
          
          {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
            <Button 
              onClick={() => navigate('/projects/create')}
              variant="primary"
              size="md"
              leftIcon={<Plus size={18} />}
            >
              Initiate Project
            </Button>
          )}
        </header>

        <div className="mb-10">
          <Input 
            label="Search Directory"
            placeholder="Search by keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bg-brand-navy/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id} 
                className="flex flex-col justify-between p-8 group cursor-pointer hover:border-brand-orange/30 transition-all shadow-sm hover:shadow-md"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <Badge variant="info">{project.visibility}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-navy group-hover:text-brand-orange transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-brand-navy/60 line-clamp-3 mb-8 leading-relaxed font-light">
                    {project.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-brand-navy/5">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-xs font-bold text-brand-navy/50">
                      <GraduationCap className="w-4 h-4 mr-3 text-brand-orange" />
                      <span className="truncate">{project.group_name || 'Individual Cluster'}</span>
                    </div>
                    <div className="flex items-center text-xs font-bold text-brand-navy/30">
                      <Flag className="w-4 h-4 mr-3 text-brand-orange" />
                      <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Open Enrollment'}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-brand-navy group-hover:text-white" rightIcon={<ArrowRight size={14} />}>
                    View Project
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-brand-navy/10 rounded-2xl">
            <p className="text-brand-navy/30 text-lg italic">No research opportunities found matching your query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
