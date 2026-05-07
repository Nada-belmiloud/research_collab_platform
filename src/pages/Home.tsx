import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Globe, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const Home: React.FC = () => {
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
              <h1 className="text-6xl md:text-8xl font-sans leading-[0.9] mb-8">
                The Future of <span className="text-brand-orange decoration-brand-navy/10 underline-offset-8">Research</span> <br />
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

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-6">Designed for Researchers.</h2>
            <p className="text-brand-navy/60 leading-relaxed font-sans font-light italic">
              "Research is formalized curiosity. It is poking and prying with a purpose."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Project Matching", desc: "Find projects that align perfectly with your credentials and aspirations." },
              { icon: Users, title: "Peer Collaboration", desc: "Join global calls and form research teams across different timezones and fields." },
              { icon: Globe, title: "Institutional Links", desc: "Direct communication channels with department heads and lab managers." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl border border-brand-navy/5 hover:border-brand-orange/20 hover:bg-brand-cream/30 transition-all"
              >
                <div className="w-14 h-14 bg-brand-navy/5 rounded-2xl flex items-center justify-center mb-6">
                  <f.icon className="w-7 h-7 text-brand-navy" />
                </div>
                <h3 className="text-2xl mb-4">{f.title}</h3>
                <p className="text-brand-navy/60 font-sans leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
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
              <h2 className="text-4xl md:text-5xl mb-8 font-bold leading-tight">
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
