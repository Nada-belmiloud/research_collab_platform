import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, ExternalLink, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { landingPageService } from '../services/api';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

interface LandingData {
  labs: any[];
  featured_teams: any[];
  open_projects: any[];
  open_collaboration_calls: any[];
  publications: any[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await landingPageService.getLandingData();
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section Refined */}
      <section className="relative pt-36 pb-28 overflow-hidden bg-texture">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="info" className="mb-8">Global Scientific Network</Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 tracking-tight text-brand-navy">
              Scientific Discovery <br />
              <span className="text-brand-orange italic font-normal">Starts With Us.</span>
            </h1>
            <p className="text-base md:text-lg text-brand-navy/60 max-w-2xl mx-auto mb-12 leading-relaxed font-sans font-light">
              Connect with world-class faculty, apply for groundbreaking projects, and join research clusters
              leading global innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/projects')} size="lg" rightIcon={<ArrowRight size={18} />}>
                Explore Research
              </Button>
              <Button onClick={() => navigate('/register')} variant="outline" size="lg">
                Join Network
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Content Refined */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-32">
              {/* Featured Projects */}
              <div>
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h2 className="text-3xl font-bold text-brand-navy">Open Research</h2>
                    <p className="text-sm text-brand-navy/40 font-sans mt-1">Active calls seeking collaboration</p>
                  </div>
                  <Button onClick={() => navigate('/projects')} variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                    View All
                  </Button>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {data?.open_projects.slice(0, 3).map((project) => (
                    <Card key={project.id} className="p-8 flex flex-col group cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                      <div className="flex-grow">
                        <Badge variant="info" className="mb-6">{project.lab_name}</Badge>
                        <h3 className="text-xl font-bold mb-4 text-brand-navy group-hover:text-brand-orange transition-colors">{project.title}</h3>
                        <p className="text-sm text-brand-navy/60 line-clamp-3 mb-8 leading-relaxed font-light">
                          {project.description}
                        </p>
                      </div>
                      <Button onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }} variant="outline" size="sm" className="w-full group-hover:bg-brand-navy group-hover:text-white" rightIcon={<ArrowRight size={14} />}>
                        View Details
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Featured Teams */}
              <div>
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h2 className="text-3xl font-bold text-brand-navy">Research Clusters</h2>
                    <p className="text-sm text-brand-navy/40 font-sans mt-1">Specialized groups leading innovation</p>
                  </div>
                  <Button onClick={() => navigate('/teams')} variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                    View All
                  </Button>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {data?.featured_teams.slice(0, 3).map((team) => (
                    <Card key={team.id} className="p-8 flex flex-col group cursor-pointer" onClick={() => navigate(`/teams/${team.id}`)}>
                      <div className="w-12 h-12 bg-brand-navy/5 rounded-xl flex items-center justify-center mb-8 text-brand-navy group-hover:bg-brand-orange group-hover:text-white transition-all">
                        <Users size={24} />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold mb-3 text-brand-navy group-hover:text-brand-orange transition-colors">
                          {team.name}
                        </h3>
                        <p className="text-sm text-brand-navy/60 line-clamp-3 mb-8 leading-relaxed font-light">
                          {team.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-brand-navy/5">
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-navy/30">
                          <Building size={14} className="mr-3" />
                          {team.lab_name}
                        </div>
                        <Badge variant="success">{team.project_count} Projects</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section Refined */}
      <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Join the Scientific Vanguard.
            </h2>
            <p className="text-white/50 mb-12 text-base md:text-lg font-light leading-relaxed">
              Create a researcher profile, contribute to projects, and start your journey in scientific discovery.
            </p>
            <Button
              onClick={() => navigate('/register')}
              variant="secondary"
              size="lg"
              className="px-12 py-5 text-xl"
              rightIcon={<ExternalLink size={24} />}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
