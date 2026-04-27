
import { motion } from "motion/react";
import { Mail, Github, Linkedin, Award, BookOpen, GraduationCap, Briefcase, MapPin, ExternalLink, Edit3, FileText, Plus, Megaphone, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { UserRole } from "../types";

export default function Profile() {
  const [userRole] = useState<UserRole>(localStorage.getItem("role") as UserRole || "student");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [postType, setPostType] = useState<"discussion" | "recruitment">("discussion");

  const [profile, setProfile] = useState({
    name: "Amira Benali",
    email: "amira.benali@ensia.edu.dz",
    bio: "Passionate AI student at ENSIA specializing in Machine Learning and Computer Vision. Focusing on building scalable solutions for real-world automated systems.",
    location: "Algiers, Algeria",
    github: "#",
    linkedin: "#"
  });

  return (
    <div className="pt-24 pb-20 bg-[#f8f7f4] min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-[40px] border border-[#0e4971]/10 p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f37e22]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[32px] bg-[#0e4971] text-white flex items-center justify-center font-serif text-5xl md:text-7xl font-bold shadow-2xl shadow-[#0e4971]/20 border-4 border-white">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-grow space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0e4971] tracking-tight">{profile.name}</h1>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${userRole === 'student' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#0e4971]/10 text-[#0e4971]'}`}>
                    {userRole}
                  </span>
                </div>
                <button 
                  onClick={() => setShowEditProfile(true)}
                  className="flex items-center gap-2 text-sm font-bold text-[#0e4971] hover:text-[#f37e22] transition-colors bg-[#0e4971]/5 px-4 py-2 rounded-full"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#5b86a2]">
                <div className="flex items-center gap-2"><MapPin size={16} /> {profile.location}</div>
                <div className="flex items-center gap-2"><Mail size={16} /> {profile.email}</div>
              </div>

              <p className="text-lg text-[#0e4971] font-medium leading-relaxed max-w-2xl">
                {profile.bio}
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <a href={profile.github} className="p-3 bg-[#0e4971]/5 rounded-2xl text-[#0e4971] hover:bg-[#0e4971] hover:text-white transition-all"><Github size={20} /></a>
                <a href={profile.linkedin} className="p-3 bg-[#0e4971]/5 rounded-2xl text-[#0e4971] hover:bg-[#0e4971] hover:text-white transition-all"><Linkedin size={20} /></a>
                <button 
                  onClick={() => setShowAddPost(true)}
                  className="bg-[#f37e22] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#f37e22]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Plus size={20} /> Add Post
                </button>
                <div className="relative overflow-hidden bg-[#0e4971] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#0e4971]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer">
                  <FileText size={20} /> Update CV
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Experience / Education */}
            <div className="bg-white rounded-3xl border border-[#0e4971]/10 p-8 md:p-10">
              <h2 className="text-2xl font-serif font-bold text-[#0e4971] mb-8 flex items-center gap-3">
                <GraduationCap className="text-[#f37e22]" /> Education & Experience
              </h2>
              
              <div className="space-y-12">
                <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-[-40px] before:w-px before:bg-[#0e4971]/10 last:before:hidden">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-[#f37e22]" />
                  <div className="mb-2 flex justify-between items-start">
                    <h3 className="font-bold text-[#0e4971]">ENSIA Algiers</h3>
                    <span className="text-[10px] font-bold text-[#5b86a2] uppercase bg-[#f8f7f4] px-2 py-1 rounded">2023 — Present</span>
                  </div>
                  <p className="text-sm font-semibold text-[#5b86a2] mb-2 uppercase tracking-wider text-[11px]">BSc in Artificial Intelligence</p>
                  <p className="text-sm text-[#0e4971]/70 leading-relaxed">Currently exploring Reinforcement Learning and Neural Architecture Search. GPA: 3.8/4.0.</p>
                </div>

                <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-[-40px] before:w-px before:bg-[#0e4971]/10 last:before:hidden">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-[#0e4971]" />
                  <div className="mb-2 flex justify-between items-start">
                    <h3 className="font-bold text-[#0e4971]">MLDL Lab Collaboration</h3>
                    <span className="text-[10px] font-bold text-[#5b86a2] uppercase bg-[#f8f7f4] px-2 py-1 rounded">Winter 2025</span>
                  </div>
                  <p className="text-sm font-semibold text-[#5b86a2] mb-2 uppercase tracking-wider text-[11px]">Research Assistant</p>
                  <p className="text-sm text-[#0e4971]/70 leading-relaxed">Contributed to 'Predictive Maintenance for Industrial IoT' paper. Optimized the data preprocessing pipeline using PySpark.</p>
                </div>
              </div>
            </div>

            {/* Contributions */}
            <div className="bg-white rounded-3xl border border-[#0e4971]/10 p-8 md:p-10">
              <h2 className="text-2xl font-serif font-bold text-[#0e4971] mb-8 flex items-center gap-3">
                <BookOpen className="text-[#f37e22]" /> ENSIA Contributions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "RL in Robotics", lab: "MLDL Lab", role: "Contributor" },
                  { title: "Arabic Sentiment", lab: "NLP Lab", role: "Student Lead" }
                ].map((c, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-[#0e4971]/5 bg-[#f8f7f4]/50 hover:bg-white hover:border-[#f37e22]/20 transition-all group">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#5b86a2] block mb-2">{c.lab}</span>
                    <h4 className="font-serif font-bold text-[#0e4971] group-hover:text-[#f37e22] transition-colors mb-4">{c.title}</h4>
                    <div className="flex justify-between items-center text-[10px] font-bold text-[#0e4971]">
                      <span className="bg-[#0e4971]/5 px-2 py-1 rounded">{c.role}</span>
                      <span className="flex items-center gap-1">Open Paper <ExternalLink size={12} /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#0e4971] rounded-3xl p-8 text-white">
              <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
                <Award className="text-[#f37e22]" /> Verified Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Python", "PyTorch", "TensorFlow", "C++", "MLOps", "Computer Vision", "NLP", "Data Engineering"].map(s => (
                  <span key={s} className="text-[11px] font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#0e4971]/10 p-8 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-[#0e4971] mb-6 flex items-center gap-2">
                <Briefcase className="text-[#f37e22]" /> Seeking
              </h3>
              <ul className="space-y-3 text-sm text-[#5b86a2] font-medium leading-relaxed">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f37e22]" />
                  Collaborators for CV projects
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f37e22]" />
                  Paper mentorship in Robotics
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f37e22]" />
                  Open research datasets
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#0e4971]">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)}><X size={24} className="text-[#5b86a2]" /></button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0e4971] uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl px-4 py-3 text-[#0e4971]" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0e4971] uppercase tracking-wider mb-2">Bio</label>
                <textarea 
                  className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl px-4 py-3 text-[#0e4971] min-h-[100px]" 
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0e4971] uppercase tracking-wider mb-2">Location</label>
                <input 
                  type="text" 
                  className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl px-4 py-3 text-[#0e4971]" 
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 px-6 py-3 rounded-full text-sm font-bold text-[#5b86a2] hover:bg-[#f8f7f4] transition-colors">Cancel</button>
                <button type="submit" onClick={(e) => { e.preventDefault(); setShowEditProfile(false); }} className="flex-1 px-6 py-3 rounded-full text-sm font-bold text-white bg-[#0e4971] hover:bg-[#0a3a5c] transition-colors">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Post Modal */}
      {showAddPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#0e4971]">Create New Post</h2>
              <button onClick={() => setShowAddPost(false)}><X size={24} className="text-[#5b86a2]" /></button>
            </div>
            
            <div className="space-y-6">
              {userRole === "teacher" && (
                <div className="flex gap-2 bg-[#f8f7f4] p-1 rounded-full">
                  <button 
                    onClick={() => setPostType("discussion")}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${postType === 'discussion' ? 'bg-[#0e4971] text-white shadow-md' : 'text-[#5b86a2]'}`}
                  >
                    Simple Discussion
                  </button>
                  <button 
                    onClick={() => setPostType("recruitment")}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${postType === 'recruitment' ? 'bg-[#f37e22] text-white shadow-md' : 'text-[#5b86a2]'}`}
                  >
                    Recruitment
                  </button>
                </div>
              )}

              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0e4971] uppercase tracking-wider mb-2">Post Title</label>
                  <input type="text" className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl px-4 py-3 text-[#0e4971]" placeholder="What's on your mind?" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0e4971] uppercase tracking-wider mb-2">Description</label>
                  <textarea className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl px-4 py-3 text-[#0e4971] min-h-[120px]" placeholder="Deep dive into your project or topic..." />
                </div>
                {postType === "recruitment" && userRole === "teacher" && (
                  <div>
                    <label className="block text-xs font-bold text-[#0e4971] uppercase tracking-wider mb-2">Who are you looking for?</label>
                    <select className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl px-4 py-3 text-[#0e4971]">
                      <option>Recruit Students</option>
                      <option>Recruit Teachers (Collaboration)</option>
                      <option>Both</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddPost(false)} className="flex-1 px-6 py-3 rounded-full text-sm font-bold text-[#5b86a2] hover:bg-[#f8f7f4] transition-colors">Cancel</button>
                  <button type="submit" onClick={(e) => { e.preventDefault(); setShowAddPost(false); }} className="flex-1 px-6 py-3 rounded-full text-sm font-bold text-white bg-[#0e4971] hover:bg-[#0a3a5c] transition-colors">Post</button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
