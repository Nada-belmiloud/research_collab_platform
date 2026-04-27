import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Megaphone, Clock, Filter, MessageSquare, Mail, ArrowUpRight, Plus, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const FEED_ITEMS = [
  {
    id: 1,
    type: "recruitment",
    author: "Dr. Amine Mansouri",
    title: "Looking for 2 Students for RL-based Robotics Project",
    desc: "We are starting a new initiative at MLDL Lab focused on reinforcement learning for autonomous navigation. Looking for students with strong Python skills.",
    tags: ["Robotics", "Reinforcement Learning", "Python"],
    time: "2h ago",
    lab: "MLDL Lab",
    isPublic: true,
  },
  {
    id: 2,
    type: "discussion",
    author: "Sarah B.",
    title: "New Paper: Transferred Learning in Arabic NLP",
    desc: "Check out our latest publication on using multilingual models for Algerian dialect analysis. Feedback welcome!",
    tags: ["NLP", "Arabic", "Research"],
    time: "5h ago",
    lab: "NLP Lab",
    isPublic: false,
  },
  {
    id: 3,
    type: "recruitment",
    author: "Prof. Sid Ahmed",
    title: "Open Position: Research Assistant in Computer Vision",
    desc: "Seeking a motivated researcher to help with dataset annotation and model training for urban drone navigation.",
    tags: ["Computer Vision", "Drones", "PyTorch"],
    time: "1d ago",
    lab: "CVR Lab",
    isPublic: true,
  },
];

export default function Explore() {
  const [filter, setFilter] = useState<"all" | "recruitment" | "discussion">("all");
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);

  const handleApply = (id: number) => {
    if (appliedIds.includes(id)) return;
    setAppliedIds([...appliedIds, id]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredItems = FEED_ITEMS.filter(item => filter === "all" || item.type === filter);

  return (
    <div className="pt-24 pb-20 bg-[#f8f7f4] min-h-screen relative">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
            <h1 className="text-4xl font-serif font-bold text-[#0e4971]">Explore Feed</h1>
            <div className="flex items-center gap-3">
              <Link 
                to="/submit" 
                className="flex items-center gap-2 bg-[#f37e22] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-[#f37e22]/20 hover:scale-105 transition-all"
              >
                <Plus size={18} /> New Post
              </Link>
              <button className="flex items-center gap-2 text-sm font-bold text-[#f37e22] bg-[#f37e22]/10 px-4 py-2 rounded-full">
                <Sparkles size={16} />
                AI Active
              </button>
            </div>
          </div>
          <p className="text-[#5b86a2]">Personalized research news and open positions for your profile.</p>
        </header>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'all' ? 'bg-[#0e4971] text-white' : 'bg-white text-[#5b86a2] border border-[#0e4971]/10'}`}
          >
            All Updates
          </button>
          <button 
            onClick={() => setFilter("recruitment")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'recruitment' ? 'bg-[#0e4971] text-white' : 'bg-white text-[#5b86a2] border border-[#0e4971]/10'}`}
          >
            Recruitment
          </button>
          <button 
            onClick={() => setFilter("discussion")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === 'discussion' ? 'bg-[#0e4971] text-white' : 'bg-white text-[#5b86a2] border border-[#0e4971]/10'}`}
          >
            Discussions
          </button>
        </div>

        <div className="space-y-6">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-[#0e4971]/10 p-6 md:p-8 shadow-sm hover:border-[#f37e22]/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0e4971]/5 flex items-center justify-center font-bold text-[#0e4971]">
                    {item.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0e4971]">{item.author}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#5b86a2]">
                      <span>{item.lab}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                      {!item.isPublic && (
                        <span className="bg-[#0e4971]/5 text-[#0e4971] px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider">Internal</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`p-2 rounded-xl ${item.type === 'recruitment' ? 'bg-[#f37e22]/10 text-[#f37e22]' : 'bg-[#5b86a2]/10 text-[#5b86a2]'}`}>
                  {item.type === 'recruitment' ? <Megaphone size={20} /> : <MessageSquare size={20} />}
                </div>
              </div>

              <h3 className="text-xl font-serif font-bold text-[#0e4971] mb-3 group-hover:text-[#f37e22] transition-colors">{item.title}</h3>
              <p className="text-[#5b86a2] text-sm leading-relaxed mb-6">{item.desc}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-[#0e4971] bg-[#0e4971]/5 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#0e4971]/5">
                <div className="flex items-center gap-4">
                  {item.type === 'recruitment' ? (
                    <button 
                      onClick={() => handleApply(item.id)}
                      disabled={appliedIds.includes(item.id)}
                      className={`text-sm font-bold px-6 py-2 rounded-full transition-colors ${
                        appliedIds.includes(item.id) 
                          ? 'bg-green-100 text-green-700 cursor-default' 
                          : 'bg-[#0e4971] text-white hover:bg-[#0a3a5c]'
                      }`}
                    >
                      {appliedIds.includes(item.id) ? 'Applied' : 'Apply Now'}
                    </button>
                  ) : (
                    <button className="text-[#0e4971] text-sm font-bold hover:underline underline-offset-4">
                      Read Discussion
                    </button>
                  )}
                </div>
                <button className="text-[#5b86a2] hover:text-[#0e4971] flex items-center gap-1 text-sm font-medium">
                  Contact <ArrowUpRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Add Post Fixed Button */}
      <Link 
        to="/submit"
        className="fixed bottom-32 right-8 w-16 h-16 bg-[#f37e22] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all md:hidden"
      >
        <Plus size={28} />
      </Link>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-[#0e4971] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
          >
            <CheckCircle2 size={20} className="text-green-400" />
            <span className="font-bold text-sm tracking-tight">Application sent successfully!</span>
            <button onClick={() => setShowToast(false)} className="ml-2 hover:bg-white/10 p-1 rounded-full">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
