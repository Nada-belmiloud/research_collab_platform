import React from 'react';
import { motion } from 'motion/react';
import { Target, Shield, Heart, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-cream">
      <section className="pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-sans font-bold text-brand-navy mb-8 leading-[0.9]"
          >
            Engineering <br /><span className="italic font-normal text-brand-orange">Discovery.</span>
          </motion.h1>
          <p className="text-xl text-brand-navy/60 font-sans font-light leading-relaxed mb-16">
            Research Lab is a specialized ecosystem designed to bridge the gap between academic theory 
            and practical breakthrough. We provide the tools for scholars to connect, collaborate, and 
            change the world through unified scientific inquiry.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Precision", desc: "Highly targeted project matching based on specialized skillsets and academic history." },
              { icon: Shield, title: "Integrity", desc: "A secure repository for research intellectual property and collaborative verified data." },
              { icon: Heart, title: "Community", desc: "A human-centric approach to scientific networking, fostering mentorship and growth." },
              { icon: Zap, title: "Velocity", desc: "Accelerating the cycle of research from initial call to published breakthrough." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[3rem] border border-brand-navy/5 bg-brand-cream/20"
              >
                <div className="w-14 h-14 bg-brand-navy text-white rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-brand-navy/50 text-sm font-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-lg text-brand-navy/60 font-sans font-light leading-relaxed italic">
            "To democratize research opportunities and create a borderless laboratory where 
            intellect is the only requirement for entry."
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
