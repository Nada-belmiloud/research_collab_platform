import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Play, Target, Award, Sparkles, ChevronRight } from "lucide-react";

export default function Ranking() {
  const [projectTitle, setProjectTitle] = useState("");
  const [skills, setSkills] = useState([{ name: "", weight: 0.5 }]);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const addSkill = () => setSkills([...skills, { name: "", weight: 0.5 }]);
  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));
  const updateSkill = (index: number, field: "name" | "weight", value: any) => {
    const newSkills = [...skills];
    // @ts-ignore
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const totalWeight = skills.reduce((sum, s) => sum + Number(s.weight), 0);

  const runModel = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 4000);
  };

  return (
    <div className="pt-24 pb-20 bg-[#f8f7f4] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#5b86a2]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5b86a2]">AI Matching Engine</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#0e4971] mb-2 tracking-tight">Student Ranking Configuration</h1>
          <p className="text-[#5b86a2]">Define your project parameters to rank candidates using fuzzy matching and semantic analysis.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#0e4971]/10 p-8 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">Project Title</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. AI Research Project — NLP & Data Science"
                    className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl py-3 px-4 outline-none focus:border-[#0e4971] transition-colors font-medium text-[#0e4971]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pl-1">
                    <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest">Required Skills & Weight</label>
                    <span className={`text-[10px] font-bold ${Math.abs(totalWeight - 1) < 0.01 ? 'text-[#22c55e]' : 'text-[#f37e22]'}`}>
                      Total Weight: {totalWeight.toFixed(1)} / 1.0
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(index, "name", e.target.value)}
                          placeholder="Skill name..."
                          className="flex-grow bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl py-3 px-4 outline-none focus:border-[#0e4971] transition-colors text-sm"
                        />
                        <div className="w-24">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            value={skill.weight}
                            onChange={(e) => updateSkill(index, "weight", e.target.value)}
                            className="w-full bg-[#f8f7f4] border border-[#0e4971]/10 rounded-xl py-3 px-4 outline-none focus:border-[#0e4971] transition-colors text-sm text-center font-bold"
                          />
                        </div>
                        <button 
                          onClick={() => removeSkill(index)}
                          className="p-3 text-[#f37e22] hover:bg-[#f37e22]/5 rounded-xl transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addSkill}
                    className="w-full border-2 border-dashed border-[#0e4971]/10 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-bold text-[#5b86a2] hover:border-[#0e4971]/30 hover:text-[#0e4971] transition-all"
                  >
                    <Plus size={16} /> Add skill requirement
                  </button>
                </div>
              </div>

              <div className="mt-12">
                <button
                  disabled={isRunning || !projectTitle}
                  onClick={runModel}
                  className="w-full bg-[#0e4971] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0e4971]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                      />
                      Running Matching Model...
                    </>
                  ) : (
                    <>
                      <Play size={18} /> Run matching model
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0e4971] rounded-3xl p-8 text-white">
              <Target className="text-[#f37e22] mb-6" size={32} />
              <h3 className="text-xl font-serif font-bold mb-4">How it works</h3>
              <ul className="space-y-4 text-sm text-white/70 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-[#f37e22] font-bold">01</span>
                  <span>Skills are matched semantically (e.g. 'Deep Learning' matches 'Neural Networks').</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f37e22] font-bold paradox">02</span>
                  <span>Weights determine the influence of each skill on the final score.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f37e22] font-bold">03</span>
                  <span>Platform history adds a 'Contribution Bonus' to regular contributors.</span>
                </li>
              </ul>
            </div>

            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl border-2 border-[#f37e22] p-8 shadow-xl shadow-[#f37e22]/10"
                >
                  <div className="flex items-center gap-2 text-[#f37e22] font-bold text-sm uppercase tracking-widest mb-6">
                    <Sparkles size={18} /> Match Results
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0e4971] text-white flex items-center justify-center font-bold">AB</div>
                      <div className="flex-grow">
                        <div className="flex justify-between text-xs font-bold text-[#0e4971] mb-1">
                          <span>Amira Benali</span>
                          <span>94% Match</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0e4971]/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#f37e22] w-[94%]" />
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-[#0e4971]/5 text-[#0e4971] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0e4971]/10 transition-colors">
                      View all rankings <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
