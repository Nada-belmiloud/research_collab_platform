
import { motion } from "motion/react";
import { Plus, Megaphone, MessageSquare, Clock, Users, ArrowRight, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Post, Application } from "../types";

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "mp1",
      type: "recruitment",
      author: "Amira Benali",
      authorId: "user123",
      title: "Looking for Robotics Collaboration",
      desc: "I am working on a RL project for drone navigation and need someone to help with the simulation environment setup.",
      tags: ["Robotics", "RL", "Gazebo"],
      time: "2 days ago",
      isPublic: true,
      recruitmentType: "student"
    }
  ]);

  const [applications] = useState<Application[]>([
    {
      id: "app1",
      postId: "mp1",
      applicantId: "student1",
      applicantName: "Yacine R.",
      status: "pending",
      time: "1h ago"
    },
    {
      id: "app2",
      postId: "mp1",
      applicantId: "student2",
      applicantName: "Lina S.",
      status: "accepted",
      time: "5h ago"
    }
  ]);

  return (
    <div className="pt-32 pb-20 bg-[#f8f7f4] min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#0e4971] mb-2">My Posts</h1>
            <p className="text-[#5b86a2]">Manage your research posts and view applications.</p>
          </div>
          <Link to="/submit" className="bg-[#f37e22] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#d96d1a] transition-all shadow-lg shadow-[#f37e22]/20">
            <Plus size={20} /> New Post
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {posts.map((post) => (
            <div key={post.id} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-[#0e4971]/10 p-8 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${post.type === 'recruitment' ? 'bg-[#f37e22]/10 text-[#f37e22]' : 'bg-[#5b86a2]/10 text-[#5b86a2]'}`}>
                    {post.type === 'recruitment' ? <Megaphone size={24} /> : <MessageSquare size={24} />}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5b86a2] bg-[#f8f7f4] px-3 py-1 rounded-full uppercase tracking-widest">
                    <Clock size={12} /> {post.time}
                  </div>
                </div>
                
                <h2 className="text-2xl font-serif font-bold text-[#0e4971] mb-4">{post.title}</h2>
                <p className="text-[#5b86a2] leading-relaxed mb-6">{post.desc}</p>
                
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase border border-[#0e4971]/10 text-[#0e4971] px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Applications for this post */}
              {post.type === "recruitment" && (
                <div className="pl-8 space-y-4 border-l-2 border-[#0e4971]/5 ml-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={18} className="text-[#0e4971]" />
                    <h3 className="font-bold text-[#0e4971]">Student Applications</h3>
                    <span className="bg-[#0e4971]/5 text-[#0e4971] px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {applications.filter(a => a.postId === post.id).length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applications.filter(a => a.postId === post.id).map(app => (
                      <div key={app.id} className="bg-white/60 backdrop-blur-sm border border-[#0e4971]/10 rounded-2xl p-5 flex justify-between items-center hover:border-[#f37e22]/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0e4971] text-white flex items-center justify-center font-bold text-sm">
                            {app.applicantName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#0e4971] text-sm">{app.applicantName}</h4>
                            <span className="text-[10px] text-[#5b86a2]">{app.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                            app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button for Ranking */}
        <div className="mt-16 bg-[#0e4971] rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32 blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 relative z-10">Ranking Results</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-10 relative z-10">
            View the final sorted rankings of applicants based on AI evaluation and lab criteria.
          </p>
          <Link to="/ranking" className="inline-flex items-center gap-3 bg-[#f37e22] text-white px-10 py-4 rounded-full font-bold hover:gap-5 transition-all relative z-10">
            View Rankings <Award size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
