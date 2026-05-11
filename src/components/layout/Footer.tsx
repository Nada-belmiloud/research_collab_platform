import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
            <span className="text-white font-sans text-xl font-bold italic">R</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Research Lab</span>
        </div>
        
        <div className="flex gap-8 text-white/50 text-sm font-sans">
          <a href="#" className="hover:text-brand-orange transition-colors">Documentation</a>
          <a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-orange transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-orange transition-colors">Contact</a>
        </div>
        
        <div className="text-white/30 text-xs font-mono uppercase tracking-widest">
          © 2026 RESEARCH LAB FOUNDATION
        </div>
      </div>
    </footer>
  );
};

export default Footer;
