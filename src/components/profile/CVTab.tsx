import React from 'react';
import { motion } from 'motion/react';
import { FileText, Plus, Building, GraduationCap, Terminal, ExternalLink, Trash2 } from 'lucide-react';

interface StudentCV {
  id: number;
  title: string;
  university: string;
  level: string;
  major: string;
  bio: string;
  experience: string;
  research_interests: string;
  skills: string;
  cv_url: string;
  created_at: string;
}

interface CVTabProps {
  cvList: StudentCV[];
  onUploadCV: () => void;
  onDeleteCV: (id: number) => void;
  formatDate: (dateStr: string) => string;
}

const CVTab: React.FC<CVTabProps> = ({
  cvList,
  onUploadCV,
  onDeleteCV,
  formatDate,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <FileText className="w-6 h-6 mr-3 text-brand-orange" />
          Academic CVs
          <span className="ml-3 text-xs font-bold text-brand-navy/30 bg-brand-navy/5 px-3 py-1 rounded-full">{cvList.length}</span>
        </h3>
        <button
          onClick={onUploadCV}
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Upload CV</span>
        </button>
      </div>

      {cvList.length === 0 ? (
        <div className="bg-white p-16 rounded-[3rem] border border-brand-navy/5 text-center">
          <FileText className="w-12 h-12 text-brand-navy/10 mx-auto mb-4" />
          <p className="text-brand-navy/30 font-sans mb-6">No academic CVs uploaded yet.</p>
          <button
            onClick={onUploadCV}
            className="px-6 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
          >
            Upload Your First CV
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {cvList.map((cv) => {
            const skillList = cv.skills ? cv.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
            return (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 hover:border-brand-orange/20 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-bold group-hover:text-brand-orange transition-colors">
                      {cv.title}
                    </h4>
                    <p className="text-[10px] text-brand-navy/30 font-bold uppercase tracking-widest mt-1">Uploaded {formatDate(cv.created_at)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {cv.cv_url && (
                      <a
                        href={cv.cv_url}
                        target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-brand-navy/5 hover:bg-brand-orange/10 transition-all"
                      >
                        <ExternalLink className="w-4 h-4 text-brand-navy/40 hover:text-brand-orange" />
                      </a>
                    )}
                    <button
                      onClick={() => onDeleteCV(cv.id)}
                      className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-xs font-medium text-brand-navy/60">
                      <Building className="w-4 h-4 mr-2 text-brand-orange" />
                      <span className="truncate">{cv.university}</span>
                    </div>
                    <div className="flex items-center text-xs font-medium text-brand-navy/60">
                      <GraduationCap className="w-4 h-4 mr-2 text-brand-orange" />
                      <span className="truncate">{cv.level} · {cv.major}</span>
                    </div>
                  </div>

                  {cv.research_interests && (
                    <div className="flex items-start">
                      <Terminal className="w-4 h-4 mr-2 mt-0.5 text-brand-orange shrink-0" />
                      <p className="text-[10px] font-sans text-brand-navy/60 leading-relaxed italic line-clamp-2">
                        {cv.research_interests}
                      </p>
                    </div>
                  )}

                  {skillList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {skillList.slice(0, 5).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-brand-navy/5 rounded-full text-[9px] font-bold text-brand-navy/40 uppercase tracking-tighter">
                          {skill}
                        </span>
                      ))}
                      {skillList.length > 5 && (
                        <span className="text-[9px] font-bold text-brand-navy/30">+{skillList.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CVTab;
