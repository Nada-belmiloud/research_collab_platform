import React from 'react';
import { motion } from 'motion/react';
import { BookMarked, Plus, Building, Calendar, BarChart2, ExternalLink, Trash2 } from 'lucide-react';

interface Publication {
  id: number;
  project_id: number;
  title: string;
  abstract: string;
  publication_date: string;
  venue: string;
  doi: string;
  paper_url: string;
  citation_count: number;
  created_at: string;
  authors: Array<{
    user_id: number;
    author_order: number;
    is_corresponding: boolean;
    user: { full_name: string; email: string };
  }>;
}

interface PublicationsTabProps {
  publications: Publication[];
  onAddPublication: () => void;
  onDeletePublication: (id: number) => void;
  formatDate: (dateStr: string) => string;
}

const PublicationsTab: React.FC<PublicationsTabProps> = ({
  publications,
  onAddPublication,
  onDeletePublication,
  formatDate,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <BookMarked className="w-6 h-6 mr-3 text-brand-orange" />
          Publications
          <span className="ml-3 text-xs font-bold text-brand-navy/30 bg-brand-navy/5 px-3 py-1 rounded-full">{publications.length}</span>
        </h3>
        <button
          onClick={onAddPublication}
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Publication</span>
        </button>
      </div>

      {publications.length === 0 ? (
        <div className="bg-white p-16 rounded-[3rem] border border-brand-navy/5 text-center">
          <BookMarked className="w-12 h-12 text-brand-navy/10 mx-auto mb-4" />
          <p className="text-brand-navy/30 font-sans mb-6">No publications logged yet.</p>
          <button
            onClick={onAddPublication}
            className="px-6 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
          >
            Add First Publication
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {publications.map((pub) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 hover:border-brand-orange/20 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h4 className="text-lg font-bold mb-2 group-hover:text-brand-orange transition-colors">
                    {pub.title}
                  </h4>
                  {pub.abstract && (
                    <p className="text-brand-navy/50 text-xs line-clamp-2 mb-4 font-sans leading-relaxed">
                      {pub.abstract}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-widest text-brand-navy/30">
                    {pub.venue && <span className="flex items-center"><Building className="w-3 h-3 mr-1" />{pub.venue}</span>}
                    {pub.publication_date && <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{formatDate(pub.publication_date)}</span>}
                    {pub.citation_count > 0 && <span className="flex items-center"><BarChart2 className="w-3 h-3 mr-1" />{pub.citation_count} citations</span>}
                  </div>
                  {pub.authors?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {pub.authors.map((a, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.is_corresponding ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-navy/5 text-brand-navy/50'}`}>
                          {a.user?.full_name || `Author ${i+1}`}
                          {a.is_corresponding && ' *'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {pub.paper_url && (
                    <a
                      href={pub.paper_url}
                      target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-brand-navy/5 hover:bg-brand-orange/10 transition-all"
                    >
                      <ExternalLink className="w-4 h-4 text-brand-navy/40 hover:text-brand-orange" />
                    </a>
                  )}
                  <button
                    onClick={() => onDeletePublication(pub.id)}
                    className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              {pub.doi && (
                <div className="mt-4 pt-4 border-t border-brand-navy/5">
                  <p className="text-[10px] text-brand-navy/30 font-mono">DOI: {pub.doi}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicationsTab;
