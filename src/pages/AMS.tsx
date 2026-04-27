import { motion } from "motion/react";
import { Users, Filter, ArrowUpDown, ExternalLink, Mail, Check, X, Sparkles } from "lucide-react";
import { useState } from "react";

const APPLICANTS = [
  {
    id: 1,
    name: "Amira Benali",
    role: "student",
    bio: "AI Student at ENSIA focusing on Machine Learning. Previously worked on 'Predictive Maintenance for IoT'.",
    skills: ["Python", "PyTorch", "Data Science"],
    matchScore: 94,
    status: "pending",
    contributions: 3,
  },
  {
    id: 2,
    name: "Mohammed T.",
    role: "student",
    bio: "Passionate about computer vision and its applications in healthcare. Looking for a research paper collaboration.",
    skills: ["OpenCV", "TensorFlow", "C++"],
    matchScore: 82,
    status: "pending",
    contributions: 1,
  },
  {
    id: 3,
    name: "Dr. Karim Tahi",
    role: "teacher",
    bio: "Researcher in NLP. Looking for peer-to-peer collaboration on multi-modal models.",
    skills: ["NLP", "Transformers", "Research"],
    matchScore: 91,
    status: "pending",
    contributions: 12,
  },
];

export default function AMS() {
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");
  const [applicants, setApplicants] = useState(APPLICANTS);

  const filteredApplicants = applicants.filter(a => activeTab === 'students' ? a.role === 'student' : a.role === 'teacher')
    .sort((a, b) => b.matchScore - a.matchScore);

  const handleAction = (id: number, action: 'accept' | 'reject') => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: action === 'accept' ? 'accepted' : 'rejected' } : a));
  };

  return (
    <div className="pt-24 pb-20 bg-[#f8f7f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#5b86a2]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5b86a2]">Applicant Dashboard</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#0e4971] mb-2 tracking-tight">RL Robotics Recruitment</h1>
          <p className="text-[#5b86a2]">Manage applications for your project. AI ranking is active.</p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-[#0e4971]/10">
          <div className="flex bg-white p-1 rounded-2xl border border-[#0e4971]/10">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-[#0e4971] text-white shadow-lg shadow-[#0e4971]/20' : 'text-[#5b86a2] hover:text-[#0e4971]'}`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-[#0e4971] text-white shadow-lg shadow-[#0e4971]/20' : 'text-[#5b86a2] hover:text-[#0e4971]'}`}
            >
              Other Teachers
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-bold text-[#5b86a2] hover:text-[#0e4971]">
              <Filter size={18} /> Filters
            </button>
            <button className="flex items-center gap-2 text-sm font-bold text-[#5b86a2] hover:text-[#0e4971]">
              <ArrowUpDown size={18} /> Sort by Score
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#f37e22] uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Recommended for you
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplicants.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-3xl border ${a.matchScore > 90 ? 'border-[#f37e22]/30 shadow-md shadow-[#f37e22]/5' : 'border-[#0e4971]/10'} p-8 flex flex-col relative overflow-hidden group`}
              >
                {a.matchScore > 90 && (
                  <div className="absolute top-4 right-4 bg-[#f37e22] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    TOP MATCH
                  </div>
                )} a.matchScore

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#0e4971]/5 flex items-center justify-center font-serif text-xl font-bold text-[#0e4971]">
                    {a.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0e4971] text-lg leading-tight">{a.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${a.role === 'student' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#0e4971]/10 text-[#0e4971]'}`}>
                      {a.role}
                    </span>
                  </div>
                </div>

                <div className="mb-6 space-y-4 flex-grow">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-[#5b86a2]">AI Compatibility</span>
                    <span className="text-[#0e4971]">{a.matchScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#0e4971]/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${a.matchScore}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full bg-[#0e4971]"
                    />
                  </div>
                  <p className="text-xs text-[#5b86a2] leading-relaxed line-clamp-3">
                    {a.bio}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {a.skills.map(s => (
                      <span key={s} className="text-[9px] font-bold bg-[#0e4971]/5 text-[#0e4971] px-2 py-0.5 rounded-md">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#0e4971]/5 grid grid-cols-2 gap-3">
                  {a.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleAction(a.id, 'accept')}
                        className="bg-[#0e4971] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#0a3a5c] transition-colors"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button 
                        onClick={() => handleAction(a.id, 'reject')}
                        className="bg-transparent border border-[#0e4971]/10 text-[#5b86a2] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#0e4971]/5 transition-colors"
                      >
                        <X size={14} /> Reject
                      </button>
                    </>
                  ) : (
                    <div className={`col-span-2 py-2 rounded-xl text-center text-xs font-bold ${a.status === 'accepted' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
                      {a.status.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center text-[10px] text-[#5b86a2] font-semibold">
                  <span className="flex items-center gap-1"><ExternalLink size={12} /> View Profile</span>
                  <span className="flex items-center gap-1"><Mail size={12} /> Email</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
