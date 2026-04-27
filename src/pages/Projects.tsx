import { motion } from "motion/react";
import { Plus, Briefcase, Clock, Users, Edit3, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  deadline: string;
  status: "active" | "closed" | "archived";
  applicants: number;
  createdAt: string;
}

export default function Projects() {
  const [projects] = useState<Project[]>([
    {
      id: "proj1",
      title: "AI-Powered Healthcare Diagnostics",
      category: "Research Paper",
      description: "Developing machine learning models for early disease detection using medical imaging.",
      skills: ["Python", "TensorFlow", "Medical Imaging"],
      deadline: "30/06/2025 23:59",
      status: "active",
      applicants: 12,
      createdAt: "2 weeks ago",
    },
    {
      id: "proj2",
      title: "NLP Sentiment Analysis for Social Media",
      category: "Industry Project",
      description: "Building sentiment analysis tools for real-time social media monitoring.",
      skills: ["NLP", "PyTorch", "Data Processing"],
      deadline: "15/05/2025 23:59",
      status: "active",
      applicants: 8,
      createdAt: "1 month ago",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "active" | "closed" | "archived">("all");

  const filteredProjects = projects.filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="pt-32 pb-20 bg-[#f8f7f4] min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#0e4971] mb-2">My Projects</h1>
            <p className="text-[#5b86a2]">Manage your research projects and view applications.</p>
          </div>
          <Link
            to="/create-project"
            className="bg-[#f37e22] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#f37e22]/20"
          >
            <Plus size={20} /> New Project
          </Link>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(["all", "active", "closed", "archived"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                filter === status
                  ? "bg-[#0e4971] text-white"
                  : "bg-white text-[#5b86a2] border border-[#0e4971]/10 hover:border-[#0e4971]/30"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[32px] border border-[#0e4971]/10 p-8 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#f37e22]/10 p-3 rounded-2xl group-hover:bg-[#f37e22]/20 transition-colors">
                    <Briefcase className="text-[#f37e22]" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#0e4971] mb-1">
                      {project.title}
                    </h2>
                    <p className="text-xs font-bold text-[#f37e22] uppercase tracking-widest">
                      {project.category}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    project.status === "active"
                      ? "bg-[#22c55e]/10 text-[#22c55e]"
                      : project.status === "closed"
                        ? "bg-[#f37e22]/10 text-[#f37e22]"
                        : "bg-[#5b86a2]/10 text-[#5b86a2]"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <p className="text-[#5b86a2] mb-6 line-clamp-2">{project.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-[#0e4971]/10">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-[#f37e22]" />
                  <div>
                    <p className="text-[10px] text-[#5b86a2] uppercase font-bold">Deadline</p>
                    <p className="text-[#0e4971] font-semibold">{project.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-[#f37e22]" />
                  <div>
                    <p className="text-[10px] text-[#5b86a2] uppercase font-bold">Applicants</p>
                    <p className="text-[#0e4971] font-semibold">{project.applicants} applied</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-[#5b86a2]" />
                  <div>
                    <p className="text-[10px] text-[#5b86a2] uppercase font-bold">Created</p>
                    <p className="text-[#0e4971] font-semibold">{project.createdAt}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-bold uppercase bg-[#0e4971]/5 text-[#0e4971] px-3 py-1 rounded-full"
                  >
                    #{skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button className="p-3 text-[#5b86a2] hover:bg-[#5b86a2]/5 rounded-xl transition-colors">
                  <Edit3 size={18} />
                </button>
                <button className="p-3 text-[#f37e22] hover:bg-[#f37e22]/5 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
                <Link
                  to={`/projects/${project.id}`}
                  className="ml-auto flex items-center gap-2 text-[#f37e22] font-bold hover:gap-3 transition-all"
                >
                  View Details <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <Briefcase size={48} className="text-[#5b86a2]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0e4971] mb-2">No projects yet</h3>
              <p className="text-[#5b86a2] mb-6">Create your first project to start recruiting collaborators.</p>
              <Link
                to="/create-project"
                className="inline-block bg-[#f37e22] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-all"
              >
                Create Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
