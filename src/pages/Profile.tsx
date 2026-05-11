import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, BookOpen, Settings, Terminal, 
  FileText, BookMarked 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useProfile } from '../hooks/useProfile';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

// Modular Components
import ProfileSidebar from '../components/profile/ProfileSidebar';
import OverviewTab from '../components/profile/OverviewTab';
import ProjectsTab from '../components/profile/ProjectsTab';
import PublicationsTab from '../components/profile/PublicationsTab';
import CVTab from '../components/profile/CVTab';
import SettingsTab from '../components/profile/SettingsTab';

type ActiveTab = 'overview' | 'projects' | 'publications' | 'cv' | 'settings';
type ModalType = 'project' | 'publication' | 'cv' | 'settings' | null;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile, projects, publications, cvList,
    loading, error, handleUpdateProfile, 
    handleDeleteProject, handleDeletePublication,
    handleDeleteCV, logout: authLogout
  } = useProfile();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [modal, setModal] = useState<ModalType>(null);
  const [submitting, setSubmitting] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance'>('profile');

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-6">
      <div className="text-center space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Connection lost</h2>
        <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
      </div>
    </div>
  );

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <UserIcon size={12} /> },
    { id: 'projects', label: 'Projects', icon: <BookOpen size={12} />, count: projects.length },
    { id: 'publications', label: 'Publications', icon: <BookMarked size={12} />, count: publications.length },
    { id: 'cv', label: 'CV', icon: <FileText size={12} />, count: cvList.length },
    { id: 'settings', label: 'Settings', icon: <Settings size={12} /> },
  ];

  return (
    <div className="min-h-screen bg-texture pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-8">
          
          <ProfileSidebar 
            profile={profile}
            projectsCount={projects.length}
            publicationsCount={publications.length}
            cvCount={cvList.length}
            onEditProfile={() => { setActiveTab('settings'); setSettingsTab('profile'); }}
            onUploadCV={() => setModal('cv')}
            onLogout={handleLogout}
          />

          <div className="lg:col-span-3 space-y-6">
            <header>
              <div className="inline-flex items-center space-x-2 bg-brand-navy/5 px-3 py-1 rounded-full mb-3">
                <Terminal size={12} className="text-brand-navy/40" />
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/60">Researcher Portal</span>
              </div>
              <h1 className="text-3xl font-bold text-brand-navy tracking-tight">
                Dashboard<span className="text-brand-orange">.</span>
              </h1>
              <p className="text-xs text-brand-navy/40 font-sans mt-1">
                {profile.institution || 'Independent Researcher'} · {profile.department || 'Research Cluster'}
              </p>
            </header>

            <nav className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    activeTab === tab.id ? 'bg-brand-navy text-white shadow-md' : 'bg-white text-brand-navy/40 hover:bg-brand-navy/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <Badge variant={activeTab === tab.id ? 'default' : 'info'} className="ml-1.5 scale-90">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }}
              >
                {activeTab === 'overview' && (
                  <OverviewTab 
                    profile={profile} 
                    projects={projects} 
                    publications={publications} 
                    onViewAllProjects={() => setActiveTab('projects')} 
                    onViewAllPublications={() => setActiveTab('publications')} 
                  />
                )}
                {activeTab === 'projects' && (
                  <ProjectsTab 
                    projects={projects} 
                    onAddProject={() => setModal('project')} 
                    onDeleteProject={handleDeleteProject} 
                  />
                )}
                {activeTab === 'publications' && (
                  <PublicationsTab 
                    publications={publications} 
                    onAddPublication={() => setModal('publication')} 
                    onDeletePublication={handleDeletePublication} 
                  />
                )}
                {activeTab === 'cv' && (
                  <CVTab 
                    cvList={cvList} 
                    onUploadCV={() => setModal('cv')} 
                    onDeleteCV={handleDeleteCV} 
                  />
                )}
                {activeTab === 'settings' && (
                  <SettingsTab 
                    settingsTab={settingsTab} 
                    setSettingsTab={setSettingsTab} 
                    onSave={async (data) => {
                      setSubmitting(true);
                      await handleUpdateProfile(data);
                      setSubmitting(false);
                    }}
                    submitting={submitting}
                    initialData={profile}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
