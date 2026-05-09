import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Plus, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  visibility: string;
  accepting_collaborators: boolean;
  created_at: string;
  decision_note?: string;
}

interface ProjectsTabProps {
  projects: Project[];
  onAddProject: () => void;
  onDeleteProject: (id: number) => void;
  formatDate: (dateStr: string) => string;
  StatusBadge: React.FC<{ status: string }>;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  onAddProject,
  onDeleteProject,
  formatDate,
  StatusBadge,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-brand-orange" />
          My Projects
          <span className="ml-3 text-xs font-bold text-brand-navy/30 bg-brand-navy/5 px-3 py-1 rounded-full">{projects.length}</span>
        </h3>
        <button
          onClick={onAddProject}
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white p-16 rounded-[3rem] border border-brand-navy/5 text-center">
          <BookOpen className="w-12 h-12 text-brand-navy/10 mx-auto mb-4" />
          <p className="text-brand-navy/30 font-sans mb-6">You haven't initiated any research projects yet.</p>
          <button
            onClick={onAddProject}
            className="px-6 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 hover:border-brand-orange/20 transition-all group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    project.visibility === 'PUBLIC' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {project.visibility === 'PUBLIC' ? <Eye className="w-3 h-3 inline mr-1" /> : <EyeOff className="w-3 h-3 inline mr-1" />}
                    {project.visibility}
                  </span>
                  <StatusBadge status={project.status} />
                </div>
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>

              <h4 className="text-lg font-bold mb-3 group-hover:text-brand-orange transition-colors">
                {project.title}
              </h4>
              <p className="text-brand-navy/50 text-xs line-clamp-2 mb-4 font-sans leading-relaxed">
                {project.description}
              </p>

              <div className="pt-4 border-t border-brand-navy/5 flex justify-between items-center">
                <div className="flex items-center space-x-1 text-[10px] text-brand-navy/30 font-bold uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(project.created_at)}</span>
                </div>
                {project.accepting_collaborators && (
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Accepting Collaborators
                  </span>
                )}
              </div>

              {project.decision_note && (
                <div className="mt-3 p-3 bg-brand-navy/2 rounded-xl">
                  <p className="text-[10px] text-brand-navy/40 font-medium">{project.decision_note}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
