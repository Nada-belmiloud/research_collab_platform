import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, BookOpen, Settings, Terminal, X, FileText, Check, AlertCircle, BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Project, Application, StudentCV, Publication, UserProfile } from '../types';
import api, { projectService, cvService, publicationService, userService } from '../services/api';

// Modular Components
import ProfileSidebar from '../components/profile/ProfileSidebar';
import OverviewTab from '../components/profile/OverviewTab';
import ProjectsTab from '../components/profile/ProjectsTab';
import PublicationsTab from '../components/profile/PublicationsTab';
import CVTab from '../components/profile/CVTab';
import SettingsTab from '../components/profile/SettingsTab';

// ── Types ────────────────────────────────────────────────────────────────────

// Type definitions moved to ../types.ts

type ActiveTab = 'overview' | 'projects' | 'publications' | 'cv' | 'settings';
type ModalType = 'project' | 'publication' | 'cv' | 'settings' | null;

// ── Helpers ──────────────────────────────────────────────────────────────────

// Auth logic centralized in AuthContext

const formatRole = (role: string): string =>
  role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

const getInitials = (name: string): string =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

// ── Sub-components ────────────────────────────────────────────────────────────

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    className={`fixed bottom-8 right-8 z-50 flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
  >
    {type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
    <span>{message}</span>
    <button onClick={onClose}><X className="w-4 h-4 ml-2 opacity-70 hover:opacity-100" /></button>
  </motion.div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    APPROVED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    REJECTED: 'bg-red-100 text-red-700',
    open: 'bg-green-100 text-green-700',
    closed: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

// ── Modal Wrapper ─────────────────────────────────────────────────────────────

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.96 }}
      className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-white px-8 pt-8 pb-4 border-b border-brand-navy/5 flex items-center justify-between rounded-t-[2.5rem]">
        <h3 className="text-xl font-bold text-brand-navy">{title}</h3>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-brand-navy/5 transition-all">
          <X className="w-5 h-5 text-brand-navy/40" />
        </button>
      </div>
      <div className="px-8 py-6">{children}</div>
    </motion.div>
  </motion.div>
);

// ── Field Component ───────────────────────────────────────────────────────────

const Field: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  select?: boolean;
  options?: string[];
  placeholder?: string;
}> = ({ label, name, value, onChange, type = 'text', required, textarea, select, options, placeholder }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-widest text-brand-navy/40 mb-2">
      {label}{required && <span className="text-brand-orange ml-1">*</span>}
    </label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl border border-brand-navy/10 text-sm focus:outline-none focus:border-brand-orange transition-colors resize-none"
      />
    ) : select ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-brand-navy/10 text-sm focus:outline-none focus:border-brand-orange transition-colors bg-white"
      >
        {options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-brand-navy/10 text-sm focus:outline-none focus:border-brand-orange transition-colors"
      />
    )}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout: authLogout } = useAuth();

  const logout = () => {
    authLogout();
    navigate('/login');
  };

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [cvList, setCvList] = useState<StudentCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [modal, setModal] = useState<ModalType>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance'>('profile');

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', visibility: 'PUBLIC', accepting_collaborators: true, deadline: '',
  });
  const [publicationForm, setPublicationForm] = useState({
    title: '', abstract: '', publication_date: '', venue: '', doi: '', paper_url: '', citation_count: '0',
  });
  const [cvForm, setCvForm] = useState({
    title: '', university: '', level: 'PHD', major: '', bio: '',
    experience: '', research_interests: '', skills: '', cv_url: '',
  });
  const [settingsForm, setSettingsForm] = useState({
    full_name: '', institution: '', department: '', phone_number: '',
    address: '', website: '', contact_email: '',
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [projectsRes, pubsRes, cvsRes] = await Promise.allSettled([
          projectService.getMyProjects(),
          publicationService.getAll(),
          cvService.getAll(),
        ]);

        if (currentUser) {
          setProfile(currentUser as any);
          setSettingsForm({
            full_name: currentUser.full_name || '',
            institution: currentUser.institution || '',
            department: currentUser.department || '',
            phone_number: (currentUser as any).phone_number || '',
            address: (currentUser as any).address || '',
            website: (currentUser as any).website || '',
            contact_email: (currentUser as any).contact_email || '',
          });
        }

        if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value.data);
        if (pubsRes.status === 'fulfilled') setPublications(pubsRes.value.data);
        if (cvsRes.status === 'fulfilled') setCvList(cvsRes.value.data);
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchAll();
  }, [currentUser]);

  // ── Submit handlers ────────────────────────────────────────────────────────

  const handleAddProject = async () => {
    if (!projectForm.title || !projectForm.description) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const response = await projectService.createProject(projectForm);
      setProjects((prev) => [...prev, response.data]);
      setModal(null);
      setProjectForm({
        title: '',
        description: '',
        visibility: 'PUBLIC',
        accepting_collaborators: true,
        deadline: '',
      });
      showToast('Project created successfully!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.detail || 'Failed to create project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('Project deleted successfully.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to delete project.', 'error');
    }
  };

  const handleAddPublication = async () => {
    if (!publicationForm.title) return;
    try {
      setSubmitting(true);
      const res = await publicationService.create({
        ...publicationForm,
        citation_count: Number(publicationForm.citation_count) || 0,
        authors: currentUser
          ? [
            {
              user_id: currentUser.id,
              author_order: 1,
              is_corresponding: true,
            },
          ]
          : [],
        project_id: projects[0]?.id ?? null,
      });

      setPublications((prev) => [res.data, ...prev]);
      setModal(null);
      setPublicationForm({
        title: '', abstract: '', publication_date: '', venue: '', doi: '', paper_url: '', citation_count: '0',
      });
      showToast('Publication added!', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to add publication.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePublication = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    try {
      await publicationService.delete(id);
      setPublications((prev) => prev.filter((p) => p.id !== id));
      showToast('Publication deleted.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to delete publication.', 'error');
    }
  };

  const handleUploadCV = async () => {
    if (!cvForm.title || !cvForm.university) return;
    try {
      setSubmitting(true);
      const res = await cvService.upload(cvForm as any);
      setCvList((prev) => [res.data, ...prev]);
      setModal(null);
      setCvForm({ title: '', university: '', level: 'PHD', major: '', bio: '', experience: '', research_interests: '', skills: '', cv_url: '' });
      showToast('CV uploaded!', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to upload CV.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCV = async (id: number) => {
    if (!confirm('Are you sure you want to delete this CV?')) return;
    try {
      await cvService.delete(id);
      setCvList((prev) => prev.filter((c) => c.id !== id));
      showToast('CV deleted.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to delete CV.', 'error');
    }
  };

  const handleSaveSettings = async () => {
    if (!currentUser) return;
    try {
      setSubmitting(true);
      const res = await userService.updateProfile(currentUser.id, settingsForm);
      setProfile(res.data);
      showToast('Profile updated!', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to update profile.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="bg-white p-10 rounded-[3rem] border border-brand-navy/5 shadow-2xl text-center max-w-md space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-red-500 font-medium">
            {typeof error === 'string'
              ? error
              : JSON.stringify(error, null, 2)}
          </p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const fullName = profile?.full_name || 'Anonymous User';
  const email = profile?.email || '—';
  const role = profile?.role || 'USER';
  const institution = profile?.institution || 'Independent Researcher';
  const initials = getInitials(fullName);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <BookOpen className="w-4 h-4" />, count: projects.length },
    { id: 'publications', label: 'Publications', icon: <BookMarked className="w-4 h-4" />, count: publications.length },
    { id: 'cv', label: 'My CV', icon: <FileText className="w-4 h-4" />, count: cvList.length },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-texture pb-32 pt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-10">

          {/* ── Sidebar ──────────────────────────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileSidebar
              profile={profile}
              initials={initials}
              projectsCount={projects.length}
              publicationsCount={publications.length}
              cvCount={cvList.length}
              onEditProfile={() => {
                setActiveTab('settings');
                setSettingsTab('profile');
              }}
              onUploadCV={() => setModal('cv')}
              onLogout={logout}
              formatDate={formatDate}
              formatRole={formatRole}
            />
          </div>

          {/* ── Main Content ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <header>
              <div className="inline-flex items-center space-x-2 bg-brand-navy/5 px-4 py-1.5 rounded-full mb-4">
                <Terminal className="w-4 h-4 text-brand-navy/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/60">
                  Researcher Dashboard
                </span>
              </div>
              <h1 className="text-5xl font-bold text-brand-navy mb-2">
                Welcome Back<span className="text-brand-orange">.</span>
              </h1>
              <p className="text-brand-navy/40 font-sans">
                {institution} · {profile?.department || 'Research Division'}
              </p>
            </header>

            {/* Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                    ? 'bg-brand-navy text-white shadow-lg'
                    : 'bg-white text-brand-navy/50 hover:bg-brand-navy/5 border border-brand-navy/5'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-brand-navy/5'
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Tab Content ───────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <OverviewTab
                    profile={profile}
                    projects={projects}
                    publications={publications}
                    onViewAllProjects={() => setActiveTab('projects')}
                    onViewAllPublications={() => setActiveTab('publications')}
                    formatDate={formatDate}
                    StatusBadge={StatusBadge}
                  />
                )}

                {/* PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <ProjectsTab
                    projects={projects}
                    onAddProject={() => setModal('project')}
                    onDeleteProject={handleDeleteProject}
                    formatDate={formatDate}
                    StatusBadge={StatusBadge}
                  />
                )}

                {/* PUBLICATIONS TAB */}
                {activeTab === 'publications' && (
                  <PublicationsTab
                    publications={publications}
                    onAddPublication={() => setModal('publication')}
                    onDeletePublication={handleDeletePublication}
                    formatDate={formatDate}
                  />
                )}

                {/* CV TAB */}
                {activeTab === 'cv' && (
                  <CVTab
                    cvList={cvList}
                    onUploadCV={() => setModal('cv')}
                    onDeleteCV={handleDeleteCV}
                    formatDate={formatDate}
                  />
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <SettingsTab
                    settingsTab={settingsTab}
                    setSettingsTab={setSettingsTab}
                    settingsForm={settingsForm}
                    setSettingsForm={setSettingsForm}
                    onSave={handleSaveSettings}
                    submitting={submitting}
                    Field={Field}
                  />
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {/* Add Project Modal */}
        {modal === 'project' && (
          <Modal title="Create New Project" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Field label="Project Title" name="title" value={projectForm.title} required
                onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. AI-Driven Climate Modeling" />
              <Field label="Description" name="description" value={projectForm.description} required textarea
                onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe your research project..." />
              <Field label="Visibility" name="visibility" value={projectForm.visibility} select
                options={['PUBLIC', 'PRIVATE']}
                onChange={(e) => setProjectForm((p) => ({ ...p, visibility: e.target.value }))} />
              <Field label="Project Deadline" name="deadline" value={projectForm.deadline} type="date"
                onChange={(e) => setProjectForm((p) => ({ ...p, deadline: e.target.value }))} />
              <div className="flex items-center justify-between p-4 rounded-xl border border-brand-navy/5">
                <div>
                  <p className="text-sm font-bold">Accepting Collaborators</p>
                  <p className="text-xs text-brand-navy/40">Allow others to apply to join this project</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={projectForm.accepting_collaborators}
                    onChange={(e) => setProjectForm((p) => ({ ...p, accepting_collaborators: e.target.checked }))}
                  />
                  <div className="w-10 h-5 bg-brand-navy/10 rounded-full peer peer-checked:bg-brand-orange transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-brand-navy/10 text-sm font-bold text-brand-navy/50 hover:bg-brand-navy/5 transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  disabled={submitting || !projectForm.title || !projectForm.description}
                  className="flex-1 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add Publication Modal */}
        {modal === 'publication' && (
          <Modal title="Add Publication" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Field label="Title" name="title" value={publicationForm.title} required
                onChange={(e) => setPublicationForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Publication title..." />
              <Field label="Abstract" name="abstract" value={publicationForm.abstract} textarea
                onChange={(e) => setPublicationForm((p) => ({ ...p, abstract: e.target.value }))}
                placeholder="Brief abstract..." />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Venue / Journal" name="venue" value={publicationForm.venue}
                  onChange={(e) => setPublicationForm((p) => ({ ...p, venue: e.target.value }))}
                  placeholder="e.g. NeurIPS 2025" />
                <Field label="Publication Date" name="publication_date" value={publicationForm.publication_date} type="date"
                  onChange={(e) => setPublicationForm((p) => ({ ...p, publication_date: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="DOI" name="doi" value={publicationForm.doi}
                  onChange={(e) => setPublicationForm((p) => ({ ...p, doi: e.target.value }))}
                  placeholder="10.xxxx/xxxxx" />
                <Field label="Citation Count" name="citation_count" value={publicationForm.citation_count} type="number"
                  onChange={(e) => setPublicationForm((p) => ({ ...p, citation_count: e.target.value }))} />
              </div>
              <Field label="Paper URL" name="paper_url" value={publicationForm.paper_url}
                onChange={(e) => setPublicationForm((p) => ({ ...p, paper_url: e.target.value }))}
                placeholder="https://arxiv.org/..." />
              <div className="flex space-x-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-brand-navy/10 text-sm font-bold text-brand-navy/50 hover:bg-brand-navy/5 transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleAddPublication}
                  disabled={submitting || !publicationForm.title}
                  className="flex-1 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Publication'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Upload CV Modal */}
        {modal === 'cv' && (
          <Modal title="Upload CV" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Field label="CV Title" name="title" value={cvForm.title} required
                onChange={(e) => setCvForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Research CV 2025" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="University" name="university" value={cvForm.university} required
                  onChange={(e) => setCvForm((p) => ({ ...p, university: e.target.value }))}
                  placeholder="MIT" />
                <Field label="Level" name="level" value={cvForm.level} select
                  options={['PHD', 'MASTERS', 'BACHELORS', 'POSTDOC']}
                  onChange={(e) => setCvForm((p) => ({ ...p, level: e.target.value }))} />
              </div>
              <Field label="Major / Field" name="major" value={cvForm.major}
                onChange={(e) => setCvForm((p) => ({ ...p, major: e.target.value }))}
                placeholder="e.g. Computer Science" />
              <Field label="Bio" name="bio" value={cvForm.bio} textarea
                onChange={(e) => setCvForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="A short bio..." />
              <Field label="Experience" name="experience" value={cvForm.experience} textarea
                onChange={(e) => setCvForm((p) => ({ ...p, experience: e.target.value }))}
                placeholder="Research and work experience..." />
              <Field label="Research Interests" name="research_interests" value={cvForm.research_interests}
                onChange={(e) => setCvForm((p) => ({ ...p, research_interests: e.target.value }))}
                placeholder="e.g. Machine Learning, NLP, Robotics" />
              <Field label="Skills" name="skills" value={cvForm.skills}
                onChange={(e) => setCvForm((p) => ({ ...p, skills: e.target.value }))}
                placeholder="e.g. Python, PyTorch, R, LaTeX" />
              <Field label="CV URL (optional)" name="cv_url" value={cvForm.cv_url}
                onChange={(e) => setCvForm((p) => ({ ...p, cv_url: e.target.value }))}
                placeholder="https://drive.google.com/..." />
              <div className="flex space-x-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-brand-navy/10 text-sm font-bold text-brand-navy/50 hover:bg-brand-navy/5 transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleUploadCV}
                  disabled={submitting || !cvForm.title || !cvForm.university}
                  className="flex-1 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Uploading...' : 'Upload CV'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Toast */}
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
