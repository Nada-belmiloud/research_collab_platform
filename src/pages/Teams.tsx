import React, { useState, useEffect } from 'react';
import { teamService } from '../services/api';
import { Team } from '../types';
import { motion } from 'motion/react';
import { Users, Search, ArrowRight, Tag } from 'lucide-react';

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await teamService.getTeams();
        setTeams(response.data);
      } catch (err) {
        console.error('Failed to fetch teams', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-texture pb-32 pt-12">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-brand-navy mb-6">Research <br /><span className="italic leading-none font-normal">Teams</span></h1>
          <p className="text-xl text-brand-navy/60 font-sans max-w-2xl font-light">
            Connect with existing research groups or find partners for your next breakthrough project.
          </p>
        </header>

        <div className="relative mb-12 max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/30" />
          <input
            type="text"
            placeholder="Search teams by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-brand-navy/10 rounded-full focus:border-brand-orange outline-none shadow-sm transition-all text-brand-navy"
          />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-brand-navy/5 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeams.map((team) => (
              <motion.div
                layout
                key={team.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white p-10 rounded-[3rem] border border-brand-navy/5 hover:border-brand-orange/30 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-brand-navy/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-orange transition-colors">{team.name}</h3>
                  <p className="text-brand-navy/60 text-sm line-clamp-3 mb-8 font-sans leading-relaxed">
                    {team.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-brand-cream border border-brand-navy/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-navy/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-navy/5 flex items-center justify-between">
                  <div className="text-xs font-bold text-brand-navy/30 uppercase tracking-widest">
                    {team.membersCount} Members
                  </div>
                  <button className="flex items-center space-x-2 text-brand-navy hover:text-brand-orange font-bold text-xs group/btn">
                    <span>View Team</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredTeams.length === 0 && (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-bold mb-2">No teams found.</h3>
            <p className="text-brand-navy/40">Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
