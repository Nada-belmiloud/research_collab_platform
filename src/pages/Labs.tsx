import React, { useState, useEffect } from 'react';
import { labService } from '../services/api';
import { ResearchLab } from '../types';
import { FlaskConical, Globe, MapPin, Search, Plus, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const Labs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [labs, setLabs] = useState<ResearchLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await labService.getAll();
        setLabs(res.data);
      } catch (err) {
        console.error('Failed to fetch labs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-cream/30 p-8 pt-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-bold text-brand-navy tracking-tight">
              Research <span className="italic text-brand-orange font-normal text-3xl">Clusters</span>
            </h1>
            <p className="text-sm md:text-base text-brand-navy/60 font-sans mt-2">ENSIA Institutional Directory</p>
          </div>
          {user?.role === 'ADMIN' && (
            <Button onClick={() => navigate('/labs/create')} leftIcon={<Plus size={18} />}>
              Register Institution
            </Button>
          )}
        </header>

        <div className="mb-10">
          <Input
            label="Search Directory"
            placeholder="Search clusters by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-brand-orange animate-spin mb-4" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLabs.map((lab) => (
              <Card key={lab.id} className="flex flex-col h-full p-8 group cursor-pointer" onClick={() => navigate(`/projects?lab_id=${lab.id}`)}>
                <div className="flex-grow">
                  <div className="w-14 h-14 bg-brand-navy/5 rounded-xl flex items-center justify-center text-brand-navy mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all">
                    <FlaskConical size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-orange transition-colors">
                    {lab.name}
                  </h3>
                  <p className="text-sm text-brand-navy/50 line-clamp-3 leading-relaxed font-light">
                    {lab.description}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-brand-navy/5 space-y-4 mb-8">
                  {lab.location && (
                    <div className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-navy/40">
                      <MapPin size={14} className="mr-3" />
                      {lab.location}
                    </div>
                  )}
                  {lab.website_url && (
                    <a href={lab.website_url} target="_blank" rel="noreferrer" className="flex items-center text-xs font-bold text-brand-orange uppercase tracking-widest hover:text-brand-navy transition-colors">
                      <Globe size={14} className="mr-3" />
                      Official Website
                    </a>
                  )}
                </div>

                <Button onClick={(e) => { e.stopPropagation(); navigate(`/projects?lab_id=${lab.id}`); }} variant="outline" size="sm" className="w-full group-hover:bg-brand-navy a" rightIcon={<ArrowRight size={14} />}>
                  Explore Portfolio
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Labs;
