import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamService } from '../services/api';
import { Team } from '../types';
import { Users, Search, ArrowRight } from 'lucide-react';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const Teams: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-texture pb-20 pt-12">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-brand-navy tracking-tight">
            Research <span className="italic text-brand-orange font-normal text-3xl">Teams</span>
          </h1>
          <p className="text-sm md:text-base text-brand-navy/60 font-sans max-w-xl mt-2 leading-relaxed font-light">
            Connect with specialized groups leading innovation across the ENSIA network.
          </p>
        </header>

        <div className="mb-10">
          <Input
            label="Search Directory"
            placeholder="Search by specialization or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-brand-navy/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeams.map((team) => (
              <Card 
                key={team.id}
                className="flex flex-col justify-between p-8 group cursor-pointer hover:border-brand-orange/30 transition-all shadow-sm"
                onClick={() => navigate(`/teams/${team.id}`)}
              >
                <div>
                  <div className="w-12 h-12 bg-brand-navy/5 rounded-xl flex items-center justify-center mb-8 text-brand-navy group-hover:bg-brand-orange group-hover:text-white transition-all">
                    <Users size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-navy group-hover:text-brand-orange transition-colors">{team.name}</h3>
                  <p className="text-sm text-brand-navy/60 line-clamp-3 mb-8 leading-relaxed font-light">
                    {team.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-brand-navy/5 flex items-center justify-between gap-4">
                  <Badge variant="info">
                    {team.members?.length || 0} Members
                  </Badge>
                  <Button onClick={(e) => { e.stopPropagation(); navigate(`/teams/${team.id}`); }} variant="ghost" size="sm" className="hover:bg-brand-navy hover:text-white" rightIcon={<ArrowRight size={14} />}>
                    Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredTeams.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-brand-navy/10 rounded-2xl">
            <p className="text-brand-navy/30 text-lg italic">No specialized groups found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
