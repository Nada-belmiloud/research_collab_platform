import React from 'react';
import { 
  User as UserIcon, Mail, Building, GraduationCap, MapPin, Globe, Phone,
  BookOpen, BookMarked, ChevronRight 
} from 'lucide-react';

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  role: string;
  institution: string | null;
  department: string | null;
  contact_email: string | null;
  phone_number: string | null;
  address: string | null;
  website: string | null;
}

interface Project {
  id: number;
  title: string;
  status: string;
}

interface Publication {
  id: number;
  title: string;
  venue: string;
  publication_date: string;
}

interface OverviewTabProps {
  profile: UserProfile | null;
  projects: Project[];
  publications: Publication[];
  onViewAllProjects: () => void;
  onViewAllPublications: () => void;
  formatDate: (dateStr: string) => string;
  StatusBadge: React.FC<{ status: string }>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  profile,
  projects,
  publications,
  onViewAllProjects,
  onViewAllPublications,
  formatDate,
  StatusBadge,
}) => {
  return (
    <div className="space-y-6">
      {/* Bio / contact card */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 shadow-xl">
        <h3 className="text-lg font-bold mb-6 flex items-center">
          <UserIcon className="w-5 h-5 mr-2 text-brand-orange" />
          Academic Profile
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { label: 'Full Name', value: profile?.full_name || '—', icon: <UserIcon className="w-4 h-4" /> },
            { label: 'Email', value: profile?.email || '—', icon: <Mail className="w-4 h-4" /> },
            { label: 'Institution', value: profile?.institution || '—', icon: <Building className="w-4 h-4" /> },
            { label: 'Department', value: profile?.department || '—', icon: <GraduationCap className="w-4 h-4" /> },
            { label: 'Contact Email', value: profile?.contact_email || '—', icon: <Mail className="w-4 h-4" /> },
            { label: 'Phone', value: profile?.phone_number || '—', icon: <Phone className="w-4 h-4" /> },
            { label: 'Address', value: profile?.address || '—', icon: <MapPin className="w-4 h-4" /> },
            { label: 'Website', value: profile?.website || '—', icon: <Globe className="w-4 h-4" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-start space-x-3 p-4 rounded-xl bg-brand-navy/2 border border-brand-navy/5">
              <span className="text-brand-orange mt-0.5">{icon}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-brand-navy truncate max-w-[200px]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent projects + publications summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-brand-navy/5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-brand-orange" /> Recent Projects
            </h4>
            <button onClick={onViewAllProjects} className="text-[10px] text-brand-orange font-bold flex items-center">
              View all <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-brand-navy/5 last:border-0">
                <p className="text-xs font-medium truncate max-w-[160px]">{p.title}</p>
                <StatusBadge status={p.status} />
              </div>
            ))}
            {projects.length === 0 && <p className="text-xs text-brand-navy/30 text-center py-4">No projects yet</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-brand-navy/5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm flex items-center">
              <BookMarked className="w-4 h-4 mr-2 text-brand-orange" /> Recent Publications
            </h4>
            <button onClick={onViewAllPublications} className="text-[10px] text-brand-orange font-bold flex items-center">
              View all <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="space-y-3">
            {publications.slice(0, 3).map((p) => (
              <div key={p.id} className="py-2 border-b border-brand-navy/5 last:border-0">
                <p className="text-xs font-medium truncate">{p.title}</p>
                <p className="text-[10px] text-brand-navy/30 mt-0.5">{p.venue || '—'} · {formatDate(p.publication_date)}</p>
              </div>
            ))}
            {publications.length === 0 && <p className="text-xs text-brand-navy/30 text-center py-4">No publications yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
