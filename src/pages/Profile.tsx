import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, BookOpen, Settings, Terminal, 
  FileText, Check, AlertCircle, BookMarked 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useProfile } from '../hooks/useProfile';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
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
    loading, error, handleUpdateProfile, handleAddProject,
    handleDeleteProject, handleAddPublication, handleDeletePublication,
    handleUploadCV, handleDeleteCV, logout: authLogout
  } = useProfile();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [modal, setModal] = useState<ModalType>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance'>('profile');

  // Form states
  const [projectForm, setProjectForm] = useState({ title: '', description: '', visibility: 'PUBLIC', accepting_collaborators: true, deadline: '' });
  const [publicationForm, setPublicationForm] = useState({ title: '', abstract: '', publication_date: '', venue: '', doi: '', paper_url: '', citation_count: '0' });
  const [cvForm, setCvForm] = useState({ title: '', university: '', level: 'PHD', major: '', bio: '', experience: '', research_interests: '', skills: '', cv_url: '' });
  const [settingsForm, setSettingsForm] = useState({ full_name: profile?.full_name || '', institution: profile?.institution || '', department: profile?.department || '', phone_number: '', address: '', website: '', contact_email: '' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => { authLogout(); navigate('/login'); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-6">
      <div className="text-center space-y-4">
        <AlertCircle size={32} className="text-red-500 mx-auto" />
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
              <p className="text-xs text-brand-navy/40 font-sans mt-1">{profile.institution} · {profile.department || 'Research Cluster'}</p>
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
              <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                {activeTab === 'overview' && <OverviewTab profile={profile} projects={projects} publications={publications} onViewAllProjects={() => setActiveTab('projects')} onViewAllPublications={() => setActiveTab('publications')} />}
                {activeTab === 'projects' && <ProjectsTab projects={projects} onAddProject={() => setModal('project')} onDeleteProject={handleDeleteProject} />}
                {activeTab === 'publications' && <PublicationsTab publications={publications} onAddPublication={() => setModal('publication')} onDeletePublication={handleDeletePublication} />}
                {activeTab === 'cv' && <CVTab cvList={cvList} onUploadCV={() => setModal('cv')} onDeleteCV={handleDeleteCV} />}
                {activeTab === 'settings' && <SettingsTab settingsTab={settingsTab} setSettingsTab={setSettingsTab} settingsForm={settingsForm} setSettingsForm={setSettingsForm} onSave={async () => { setSubmitting(true); const res = await handleUpdateProfile(settingsForm); if (res.success) showToast('Profile updated!', 'success'); setSubmitting(false); }} submitting={submitting} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals Refined */}
      <Modal isOpen={modal === 'project'} onClose={() => setModal(null)} title="New Project" maxWidth="max-w-md">
        <div className="space-y-4">
          <Input label="Title" value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} />
          <Input label="Description" value={projectForm.description} textarea onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Visibility" select options={[{value: 'PUBLIC', label: 'Public'}, {value: 'PRIVATE', label: 'Private'}]} value={projectForm.visibility} onChange={(e) => setProjectForm({...projectForm, visibility: e.target.value})} />
            <Input label="Deadline" type="date" value={projectForm.deadline} onChange={(e) => setProjectForm({...projectForm, deadline: e.target.value})} />
          </div>
          <Button className="w-full" isLoading={submitting} onClick={async () => { setSubmitting(true); const res = await handleAddProject(projectForm); if (res.success) { showToast('Project created!', 'success'); setModal(null); } setSubmitting(false); }}>Create</Button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'publication'} onClose={() => setModal(null)} title="Add Publication" maxWidth="max-w-md">
        <div className="space-y-4">
          <Input label="Title" value={publicationForm.title} onChange={(e) => setPublicationForm({...publicationForm, title: e.target.value})} />
          <Input label="Abstract" value={publicationForm.abstract} textarea onChange={(e) => setPublicationForm({...publicationForm, abstract: e.target.value})} />
          <Button className="w-full" isLoading={submitting} onClick={async () => { setSubmitting(true); const res = await handleAddPublication(publicationForm); if (res.success) { showToast('Added!', 'success'); setModal(null); } setSubmitting(false); }}>Submit</Button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'cv'} onClose={() => setModal(null)} title="Upload CV" maxWidth="max-w-md">
        <div className="space-y-4">
          <Input label="Title" value={cvForm.title} onChange={(e) => setCvForm({...cvForm, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="University" value={cvForm.university} onChange={(e) => setCvForm({...cvForm, university: e.target.value})} />
            <Input label="Level" select options={[{value: 'PHD', label: 'PhD'}, {value: 'MASTERS', label: 'Masters'}, {value: 'POSTDOC', label: 'Postdoc'}]} value={cvForm.level} onChange={(e) => setCvForm({...cvForm, level: e.target.value})} />
          </div>
          <Button className="w-full" isLoading={submitting} onClick={async () => { setSubmitting(true); const res = await handleUploadCV(cvForm); if (res.success) { showToast('Uploaded!', 'success'); setModal(null); } setSubmitting(false); }}>Upload</Button>
        </div>
      </Modal>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white text-xs font-bold ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Profile;
