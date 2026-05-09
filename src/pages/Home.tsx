import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Globe, ExternalLink, Building, BookMarked, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { landingPageService } from '../services/api';

interface LandingData {
  labs: any[];
  featured_teams: any[];
  open_projects: any[];
  open_collaboration_calls: any[];
  publications: any[];
}

const Home: React.FC = () => {
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
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-texture">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-1 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-5xl font-sans leading-[1.1] mb-8 tracking-tight">
                The Future of <span className="text-brand-orange decoration-brand-navy/10 underline-offset-8 font-bold">Research</span> <br />
                Starts With Us
              </h1>
              <p className="text-lg text-brand-navy/70 max-w-lg mb-10 leading-relaxed font-sans font-light">
                Connect with world-class faculty, apply for groundbreaking projects, and join research teams
                across the globe. Research Lab is your portal to scientific discovery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="bg-brand-navy text-white px-8 py-4 rounded-full text-lg font-bold flex items-center justify-center space-x-2 shadow-xl hover:bg-brand-teal transition-all group"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-brand-navy px-8 py-4 rounded-full text-lg font-bold flex items-center justify-center border border-brand-navy/10 shadow-sm hover:shadow-md transition-all"
                >
                  Join the Network
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-32">
              {/* Featured Projects */}
              <div>
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl mb-4">Open Research Calls</h2>
                    <p className="text-brand-navy/40 font-sans">Recently listed projects seeking collaborators</p>
                  </div>
                  <Link to="/projects" className="text-brand-orange font-bold flex items-center space-x-2 hover:opacity-70 transition-all">
                    <span>View all projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {data?.open_projects.slice(0, 3).map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group p-8 rounded-[2.5rem] bg-brand-cream/30 border border-brand-navy/5 hover:border-brand-orange/20 transition-all"
                    >
                      <div className="flex items-center space-x-2 mb-6">
                        <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest border border-brand-navy/5">
                          {project.lab_name}
                        </span>
                      </div>
                      <h3 className="text-xl mb-4 group-hover:text-brand-orange transition-colors">{project.title}</h3>
                      <p className="text-brand-navy/60 font-sans text-sm line-clamp-3 mb-8 leading-relaxed">
                        {project.description}
                      </p>
                      <Link to={`/projects/${project.id}`} className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-brand-navy hover:text-brand-orange transition-colors">
                        <span>Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Featured Teams */}
              <div>
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl mb-4">Research Teams</h2>
                    <p className="text-brand-navy/40 font-sans">Connect with specialized groups leading innovation</p>
                  </div>
                  <Link to="/teams" className="text-brand-orange font-bold flex items-center space-x-2 hover:opacity-70 transition-all">
                    <span>View all teams</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {data?.featured_teams.slice(0, 3).map((team, i) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative overflow-hidden"
                    >
                      <Link to={`/teams/${team.id}`} className="block h-full">
                        <div className="p-8 rounded-[2.5rem] bg-white border border-brand-navy/5 hover:border-brand-orange/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
                          <div className="w-14 h-14 bg-brand-cream rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-orange/10 transition-colors">
                            <Users className="w-7 h-7 text-brand-navy group-hover:text-brand-orange transition-colors" />
                          </div>
                          <h3 className="text-2xl font-bold mb-4 text-brand-navy group-hover:text-brand-orange transition-colors">
                            {team.name}
                          </h3>
                          <p className="text-brand-navy/60 font-sans text-sm line-clamp-3 mb-8 leading-relaxed flex-grow">
                            {team.description}
                          </p>
                          <div className="flex items-center justify-between pt-6 border-t border-brand-navy/5">
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4 text-brand-navy/20" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">
                                {team.lab_name}
                              </span>
                            </div>
                            <div className="text-[10px] font-black text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full uppercase tracking-widest">
                              {team.project_count} Projects
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Featured Labs */}
              <div>
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl mb-4">Scientific Institutions</h2>
                    <p className="text-brand-navy/40 font-sans">Explore departments and specialized research units</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {data?.labs.slice(0, 4).map((lab, i) => (
                    <motion.div
                      key={lab.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-10 rounded-[3rem] bg-brand-navy text-white relative overflow-hidden group border border-white/5"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
                      <Building className="w-10 h-10 text-brand-orange mb-6" />
                      <h3 className="text-2xl font-bold mb-4">{lab.name}</h3>
                      <p className="text-white/60 font-sans text-sm leading-relaxed mb-8 h-20 line-clamp-3">
                        {lab.description}
                      </p>
                      <div className="flex items-center space-x-10">
                        <div className="flex flex-col">
                          <span className="text-3xl font-bold text-brand-orange">{lab.groups?.length || 0}</span>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-white/30">Research Groups</span>
                        </div>
                        <Link to={`/labs/${lab.id}`} className="text-xs font-bold uppercase tracking-widest flex items-center space-x-2 text-white/40 hover:text-white transition-colors">
                          <span>Lab Profile</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats / Call to Action */}
      <section className="py-24 bg-brand-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
          <Globe className="w-full h-full transform scale-150 translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-brand-orange/10 border border-white/10 p-12 rounded-3xl backdrop-blur-sm">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl mb-8 font-bold leading-tight">
                Ready to contribute to the next big breakthrough?
              </h2>
              <p className="text-white/70 mb-10 text-lg font-light leading-relaxed font-sans">
                Create a profile, upload your curriculum, and start applying to projects that matter.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center space-x-3 bg-brand-orange text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-brand-orange/90 transition-all shadow-2xl"
              >
                <span>Get Started Now</span>
                <ExternalLink className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
