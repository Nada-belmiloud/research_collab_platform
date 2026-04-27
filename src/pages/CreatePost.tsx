import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Megaphone, MessageSquare, Globe, Lock, Send, Sparkles, Calendar, Users, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem("role") || "student");
  const [type, setType] = useState<"recruitment" | "discussion">(userRole === "teacher" ? "recruitment" : "discussion");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");

  // Discussion Post State
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionDesc, setDiscussionDesc] = useState("");
  const [discussionTags, setDiscussionTags] = useState("");

  // Recruitment Post State
  const [recruitmentTitle, setRecruitmentTitle] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [recruitmentDesc, setRecruitmentDesc] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [collaborationType, setCollaborationType] = useState<"student" | "teacher" | "both">("both");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    navigate("/explore");
  };

  return (
    <div className="pt-24 pb-20 bg-[#f8f7f4] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#5b86a2]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5b86a2]">Collaboration Hub</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#0e4971] mb-2 tracking-tight">Create a Post</h1>
          <p className="text-[#5b86a2]">Share your research insights or recruit students for new university projects.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Post Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              disabled={userRole === "student"}
              onClick={() => setType("recruitment")}
              className={`p-6 border-2 rounded-3xl transition-all text-left flex flex-col gap-3 ${
                type === "recruitment"
                  ? "border-[#f37e22] bg-[#f37e22]/5"
                  : "border-[#0e4971]/10 bg-white hover:border-[#0e4971]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  type === "recruitment" ? "bg-[#f37e22] text-white" : "bg-[#0e4971]/5 text-[#0e4971]"
                }`}
              >
                <Megaphone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0e4971]">Recruitment</h3>
                <p className="text-xs text-[#5b86a2]">
                  {userRole === "student" ? "Only faculty can recruit." : "Find collaborators for a project."}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType("discussion")}
              className={`p-6 border-2 rounded-3xl transition-all text-left flex flex-col gap-3 ${
                type === "discussion"
                  ? "border-[#0e4971] bg-[#0e4971]/5"
                  : "border-[#0e4971]/10 bg-white hover:border-[#0e4971]/30"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  type === "discussion" ? "bg-[#0e4971] text-white" : "bg-[#0e4971]/5 text-[#5b86a2]"
                }`}
              >
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0e4971]">Discussion</h3>
                <p className="text-xs text-[#5b86a2]">Share insights or research updates.</p>
              </div>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* DISCUSSION POST FORM */}
            {type === "discussion" && (
              <motion.div
                key="discussion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[32px] border border-[#0e4971]/10 p-8 space-y-6 shadow-xl shadow-[#0e4971]/5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">Title *</label>
                  <input
                    type="text"
                    value={discussionTitle}
                    onChange={(e) => setDiscussionTitle(e.target.value)}
                    placeholder="e.g. Recent breakthrough in Transformers..."
                    className="w-full bg-[#f8f7f4] border border-[#0e4971]/5 rounded-2xl py-4 px-6 outline-none focus:border-[#0e4971] transition-colors font-medium text-[#0e4971]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">Description *</label>
                  <textarea
                    value={discussionDesc}
                    onChange={(e) => setDiscussionDesc(e.target.value)}
                    rows={6}
                    placeholder="Share your insights, research updates, or findings..."
                    className="w-full bg-[#f8f7f4] border border-[#0e4971]/5 rounded-2xl py-4 px-6 outline-none focus:border-[#0e4971] transition-colors font-medium text-[#0e4971] resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">Tags (separated by spaces)</label>
                  <input
                    type="text"
                    value={discussionTags}
                    onChange={(e) => setDiscussionTags(e.target.value)}
                    placeholder="e.g. Robotics Machine-Learning CV"
                    className="w-full bg-[#f8f7f4] border border-[#0e4971]/5 rounded-2xl py-4 px-6 outline-none focus:border-[#0e4971] transition-colors font-medium text-[#0e4971]"
                  />
                </div>
              </motion.div>
            )}

            {/* RECRUITMENT POST FORM - SIMPLIFIED */}
            {type === "recruitment" && (
              <motion.div
                key="recruitment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[32px] border border-[#0e4971]/10 p-8 space-y-6 shadow-xl shadow-[#0e4971]/5"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#0e4971]/10">
                  <Briefcase className="text-[#f37e22]" size={20} />
                  <h3 className="font-bold text-[#0e4971] text-sm">Recruitment Post</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">Title of the Post *</label>
                  <input
                    type="text"
                    value={recruitmentTitle}
                    onChange={(e) => setRecruitmentTitle(e.target.value)}
                    placeholder="e.g. Looking for NLP researchers..."
                    className="w-full bg-[#f8f7f4] border border-[#0e4971]/5 rounded-3xl py-4 px-6 outline-none focus:border-[#0e4971] transition-colors font-medium text-[#0e4971]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">Description *</label>
                  <textarea
                    value={recruitmentDesc}
                    onChange={(e) => setRecruitmentDesc(e.target.value)}
                    rows={5}
                    placeholder="Describe your project and the requirements for applicants..."
                    className="w-full bg-[#f8f7f4] border border-[#0e4971]/5 rounded-3xl py-4 px-6 outline-none focus:border-[#0e4971] transition-colors font-medium text-[#0e4971] resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">Required Skills *</label>
                  <textarea
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    rows={3}
                    placeholder="What are the skills you're looking for? (e.g. Python, NLP, PyTorch)"
                    className="w-full bg-[#f8f7f4] border border-[#0e4971]/5 rounded-3xl py-4 px-6 outline-none focus:border-[#0e4971] transition-colors font-medium text-[#0e4971] resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">Application Deadline * (DD/MM/YYYY HH:MM)</label>
                  <input
                    type="text"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    placeholder="e.g. 15/02/2025 23:59"
                    className="w-full bg-[#f8f7f4] border border-[#0e4971]/5 rounded-3xl py-4 px-6 outline-none focus:border-[#0e4971] transition-colors font-medium text-[#0e4971]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0e4971] uppercase tracking-widest pl-1">Type of Collaboration</label>
                  <select
                    value={collaborationType}
                    onChange={(e) => setCollaborationType(e.target.value as "student" | "teacher" | "both")}
                    className="w-full bg-[#f8f7f4] border border-[#0e4971]/5 rounded-3xl py-4 px-6 outline-none focus:border-[#0e4971] transition-colors font-medium text-[#0e4971]"
                  >
                    <option value="both">Both (Student & Teacher)</option>
                    <option value="student">Student Only</option>
                    <option value="teacher">Teacher Only</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy & Submit - Shared Section */}
          <div className="flex flex-col
           md:flex-row items-center justify-between gap-6">
            <div className="flex bg-white p-1 rounded-2xl border border-[#0e4971]/10 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setPrivacy("public")}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  privacy === "public"
                    ? "bg-[#0e4971] text-white shadow-lg shadow-[#0e4971]/20"
                    : "text-[#5b86a2] hover:text-[#0e4971]"
                }`}
              >
                <Globe size={14} /> Public
              </button>
              <button
                type="button"
                onClick={() => setPrivacy("private")}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  privacy === "private"
                    ? "bg-[#0e4971] text-white shadow-lg shadow-[#0e4971]/20"
                    : "text-[#5b86a2] hover:text-[#0e4971]"
                }`}
              >
                <Lock size={14} /> Internal Only
              </button>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-[#f37e22] text-white px-12 py-4 rounded-full font-bold shadow-lg shadow-[#f37e22]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Post to Explore <Send size={18} />
            </button>
          </div>
        </form>

        <div className="mt-12 p-6 bg-[#0e4971]/5 rounded-2xl border border-[#0e4971]/10 flex items-start gap-4">
          <div className="bg-[#f37e22]/10 p-2 rounded-lg">
            <Sparkles className="text-[#f37e22]" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-[#0e4971] text-sm">AI Recommendation Boost</h4>
            <p className="text-xs text-[#5b86a2] mt-1 italic">
              Public posts are automatically analyzed and suggested to researchers with matching skillsets in their Explore feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
