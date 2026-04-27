import { motion } from "motion/react";
import { Search as SearchIcon, Users, BookOpen, Database, Filter, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const RESULTS = [
  { id: 1, name: "Dr. Sarah Benali", role: "teacher", lab: "NLP Lab", skills: ["NLP", "Arabic", "Deep Learning"], status: "available" },
  { id: 2, name: "Mohammed T.", role: "student", lab: "MLDL Lab", skills: ["PyTorch", "Computer Vision"], status: "busy" },
  { id: 3, name: "Amira Benali", role: "student", lab: "CVR Lab", skills: ["Python", "Robotics"], status: "available" },
  { id: 4, name: "Prof. Sid Ahmed", role: "teacher", lab: "CVR Lab", skills: ["Robotics", "Systems"], status: "available" },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "student" | "teacher">("all");

  const filteredResults = RESULTS.filter(r => 
    (type === "all" || r.role === type) && 
    (r.name.toLowerCase().includes(query.toLowerCase()) || r.skills.some(s => s.toLowerCase().includes(query.toLowerCase())))
  );

  return (
    <div className="pt-24 pb-20 bg-[#f8f7f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Search Bar Container */}
        <div className="bg-white rounded-[40px] border border-[#0e4971]/10 p-8 md:p-12 mb-12 shadow-xl shadow-[#0e4971]/5">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-[#0e4971] mb-4">Discover the Community</h1>
            <p className="text-[#5b86a2]">Search for researchers, students, or specific expertise across ENSIA labs.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[#5b86a2]" size={24} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, laboratory, or skill (e.g. 'Arabic NLP')..."
              className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 text-xl text-[#0e4971] rounded-[24px] py-6 pl-16 pr-8 outline-none focus:border-[#f37e22] transition-colors shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="flex bg-[#f8f7f4] p-1 rounded-2xl border border-[#0e4971]/5">
              {(['all', 'student', 'teacher'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${type === t ? 'bg-white text-[#0e4971] shadow-sm' : 'text-[#5b86a2] hover:text-[#0e4971]'}`}
                >
                  {t}s
                </button>
              ))}
            </div>
            
            <button className="flex items-center gap-2 text-xs font-bold text-[#5b86a2] bg-white border border-[#0e4971]/10 px-6 py-2.5 rounded-2xl">
              <Filter size={14} /> Advanced Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResults.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-[#0e4971]/10 p-8 hover:border-[#f37e22]/30 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[22px] bg-[#0e4971]/5 text-[#0e4971] flex items-center justify-center font-serif text-2xl font-bold group-hover:bg-[#f37e22] group-hover:text-white transition-all">
                  {r.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-bold text-[#0e4971] group-hover:text-[#f37e22] transition-colors">{r.name}</h3>
                    {r.role === 'teacher' && <Star size={14} className="text-[#f37e22] fill-[#f37e22]" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#5b86a2] uppercase tracking-tight">
                    <span>{r.lab}</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'available' ? 'bg-[#22c55e]' : 'bg-[#f37e22]'}`} />
                      <span className="opacity-70">{r.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {r.skills.map(s => (
                      <span key={s} className="text-[9px] font-bold bg-[#0e4971]/5 text-[#0e4971] px-2 py-0.5 rounded-md">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="p-3 text-[#0e4971] hover:bg-[#0e4971]/5 rounded-2xl transition-all">
                <ChevronRight size={24} />
              </button>
            </motion.div>
          ))}
          
          {filteredResults.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-[#0e4971]/5 rounded-full flex items-center justify-center mx-auto text-[#5b86a2]">
                <SearchIcon size={40} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-[#0e4971]">No researchers found</h3>
                <p className="text-[#5b86a2]">Try broadening your search or checking different laboratory filters.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
