import React from 'react';
import { 
  Camera, Mail, Building, Phone, MapPin, Globe, 
  Settings, Upload, LogOut 
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
  profile_picture_url: string | null;
  created_at: string;
}

interface ProfileSidebarProps {
  profile: UserProfile | null;
  initials: string;
  projectsCount: number;
  publicationsCount: number;
  cvCount: number;
  onEditProfile: () => void;
  onUploadCV: () => void;
  onLogout: () => void;
  formatDate: (dateStr: string) => string;
  formatRole: (role: string) => string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  initials,
  projectsCount,
  publicationsCount,
  cvCount,
  onEditProfile,
  onUploadCV,
  onLogout,
  formatDate,
  formatRole,
}) => {
  const fullName = profile?.full_name || 'Anonymous User';
  const email = profile?.email || '—';
  const role = profile?.role || 'USER';
  const institution = profile?.institution || 'Independent Researcher';

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-brand-navy/5 shadow-2xl relative overflow-hidden text-center">
      <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-orange" />

      {/* Avatar */}
      <div className="relative inline-block mb-6">
        {profile?.profile_picture_url ? (
          <img
            src={profile.profile_picture_url}
            alt={fullName}
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-brand-navy text-white rounded-full flex items-center justify-center text-3xl font-bold italic mx-auto">
            {initials}
          </div>
        )}
        <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all">
          <Camera className="w-3.5 h-3.5" />
        </button>
      </div>

      <h2 className="text-xl font-bold mb-1">{fullName}</h2>
      <p className="text-[10px] font-bold text-brand-navy/30 uppercase tracking-widest mb-1">
        {formatRole(role)}
      </p>
      <p className="text-xs text-brand-navy/40 mb-6">Member since {formatDate(profile?.created_at || '')}</p>

      {/* Info rows */}
      <div className="space-y-3 text-left border-t border-brand-navy/5 pt-6">
        {[
          { icon: <Mail className="w-4 h-4" />, value: email },
          { icon: <Building className="w-4 h-4" />, value: institution },
          profile?.department && { icon: <Building className="w-4 h-4" />, value: profile.department },
          profile?.phone_number && { icon: <Phone className="w-4 h-4" />, value: profile.phone_number },
          profile?.address && { icon: <MapPin className="w-4 h-4" />, value: profile.address },
        ].filter(Boolean).map((item: any, i) => (
          <div key={i} className="flex items-center text-sm text-brand-navy/60">
            <span className="w-4 h-4 mr-3 text-brand-orange flex-shrink-0">{item.icon}</span>
            <span className="truncate text-xs">{item.value}</span>
          </div>
        ))}

        {profile?.website && (
          <div className="flex items-center text-sm text-brand-navy/60">
            <Globe className="w-4 h-4 mr-3 text-brand-orange flex-shrink-0" />
            <a
              href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
              target="_blank" rel="noopener noreferrer"
              className="truncate text-xs hover:text-brand-orange transition-colors"
            >
              {profile.website}
            </a>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-brand-navy/5">
        {[
          { label: 'Projects', value: projectsCount },
          { label: 'Pubs', value: publicationsCount },
          { label: 'CVs', value: cvCount },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-2xl font-bold text-brand-navy">{value}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-brand-navy/30">{label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="pt-6 space-y-2">
        <button
          onClick={onEditProfile}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-navy/5 rounded-xl text-xs font-bold hover:bg-brand-navy/10 transition-all"
        >
          <Settings className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
        <button
          onClick={onUploadCV}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-orange/10 text-brand-orange rounded-xl text-xs font-bold hover:bg-brand-orange/20 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload CV</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
