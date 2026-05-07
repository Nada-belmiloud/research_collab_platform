import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User as UserIcon, Mail, Briefcase, BookOpen, Settings, LogOut,
  Terminal, Phone, MapPin, Globe, Upload, Plus, X, ChevronRight,
  FileText, Edit3, Trash2, Eye, EyeOff, Check, AlertCircle,
  Building, GraduationCap, Calendar, ExternalLink, BookMarked,
  BarChart2, Bell, Shield, Palette, Save, Camera,
} from 'lucide-react';
import axios from 'axios';

// ── Types ────────────────────────────────────────────────────────────────────

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

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  visibility: string;
  accepting_collaborators: boolean;
  created_by: number;
  group_id: null;
  created_at: string;
  decision_note?: string;
}

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
  student_user_id: number;
  created_at: string;
}

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

type ActiveTab = 'overview' | 'projects' | 'publications' | 'cv' | 'settings';
type ModalType = 'project' | 'publication' | 'cv' | 'settings' | null;

// ── Helpers ──────────────────────────────────────────────────────────────────

const getToken = (): string | null =>
  localStorage.getItem('token') ||
  localStorage.getItem('access_token') ||
  localStorage.getItem('authToken');

const authAxios = axios.create({ baseURL: 'http://localhost:8000/api/v1' });
authAxios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
    className={`fixed bottom-8 right-8 z-50 flex items-center space-x-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
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
  // Auth – swap this with your actual useAuth hook
  const logout = () => { localStorage.clear(); window.location.href = '/login'; };

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
    title: '', description: '', visibility: 'PUBLIC', accepting_collaborators: true,
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
        const [profileRes, projectsRes, pubsRes, cvsRes] = await Promise.allSettled([
          authAxios.get<UserProfile>('/auth/me'),
          authAxios.get<Project[]>('/projects/'),
          authAxios.get<Publication[]>('/publications/'),
          authAxios.get<StudentCV[]>('/student-cvs/'),
        ]);

        if (profileRes.status === 'fulfilled') {
          const p = profileRes.value.data;
          setProfile(p);
          setSettingsForm({
            full_name: p.full_name || '',
            institution: p.institution || '',
            department: p.department || '',
            phone_number: p.phone_number || '',
            address: p.address || '',
            website: p.website || '',
            contact_email: p.contact_email || '',
          });
        } else {
          setError('Failed to load profile.');
        }

        if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value.data);
        if (pubsRes.status === 'fulfilled') setPublications(pubsRes.value.data);
        if (cvsRes.status === 'fulfilled') setCvList(cvsRes.value.data);
      } catch {
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Submit handlers ────────────────────────────────────────────────────────

  const handleAddProject = async () => {
  try {
    setSubmitting(true);

    const payload = {
      group_id: 1, // TEMPORARY
      title: projectForm.title,
      description: projectForm.description,
      visibility: projectForm.visibility,
      accepting_collaborators:
        projectForm.accepting_collaborators,
    };

    const response = await projectService.createProject(payload);

    setProjects((prev) => [...prev, response.data]);

    setModal(null);

    setProjectForm({
      title: '',
      description: '',
      visibility: 'PUBLIC',
      accepting_collaborators: false,
    });

  } catch (err: any) {
    console.error(err);
    alert(
      err?.response?.data?.detail ||
      'Failed to create project'
    );
  } finally {
    setSubmitting(false);
  }
};

  

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    try {
      await authAxios.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('Project deleted.', 'success');
    } catch {
      showToast('Failed to delete project.', 'error');
    }
  };

  const handleAddPublication = async () => {
    if (!publicationForm.title) return;
    try {
      setSubmitting(true);
      const res = await authAxios.post<Publication>('/publications/', {
        ...publicationForm,
        citation_count: parseInt(publicationForm.citation_count) || 0,
        authors: profile ? [{ user_id: profile.id, author_order: 1, is_corresponding: true }] : [],
        project_id: projects[0]?.id || null,
      });
      setPublications((prev) => [res.data, ...prev]);
      setModal(null);
      setPublicationForm({ title: '', abstract: '', publication_date: '', venue: '', doi: '', paper_url: '', citation_count: '0' });
      showToast('Publication added!', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to add publication.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePublication = async (id: number) => {
    if (!confirm('Delete this publication?')) return;
    try {
      await authAxios.delete(`/publications/${id}`);
      setPublications((prev) => prev.filter((p) => p.id !== id));
      showToast('Publication deleted.', 'success');
    } catch {
      showToast('Failed to delete publication.', 'error');
    }
  };

  const handleUploadCV = async () => {
    if (!cvForm.title || !cvForm.university) return;
    try {
      setSubmitting(true);
      const res = await authAxios.post<StudentCV>('/student-cvs/', {
        ...cvForm,
        student_user_id: profile?.id,
      });
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
    if (!confirm('Delete this CV?')) return;
    try {
      await authAxios.delete(`/student-cvs/${id}`);
      setCvList((prev) => prev.filter((c) => c.id !== id));
      showToast('CV deleted.', 'success');
    } catch {
      showToast('Failed to delete CV.', 'error');
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSubmitting(true);
      const res = await authAxios.put<UserProfile>('/auth/me', settingsForm);
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
          <p className="text-red-500 font-medium">{error}</p>
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
            {/* Profile Card */}
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
                  { icon: <Mail />, value: email },
                  { icon: <Building />, value: institution },
                  profile?.department && { icon: <UserIcon />, value: profile.department },
                  profile?.phone_number && { icon: <Phone />, value: profile.phone_number },
                  profile?.address && { icon: <MapPin />, value: profile.address },
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
                  { label: 'Projects', value: projects.length },
                  { label: 'Pubs', value: publications.length },
                  { label: 'CVs', value: cvList.length },
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
                  onClick={() => { setActiveTab('settings'); setSettingsTab('profile'); }}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-navy/5 rounded-xl text-xs font-bold hover:bg-brand-navy/10 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setModal('cv')}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-orange/10 text-brand-orange rounded-xl text-xs font-bold hover:bg-brand-orange/20 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload CV</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-brand-navy/5 shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 mb-4">Quick Add</p>
              <div className="space-y-2">
                <button
                  onClick={() => setModal('project')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-orange/5 transition-all group text-left"
                >
                  <div className="w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center group-hover:bg-brand-orange/20 transition-all">
                    <Plus className="w-4 h-4 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">New Project</p>
                    <p className="text-[10px] text-brand-navy/30">Start a research call</p>
                  </div>
                </button>
                <button
                  onClick={() => setModal('publication')}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-orange/5 transition-all group text-left"
                >
                  <div className="w-8 h-8 bg-brand-navy/5 rounded-lg flex items-center justify-center group-hover:bg-brand-navy/10 transition-all">
                    <BookMarked className="w-4 h-4 text-brand-navy/50" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Add Publication</p>
                    <p className="text-[10px] text-brand-navy/30">Log a paper or article</p>
                  </div>
                </button>
              </div>
            </div>
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
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-brand-navy text-white shadow-lg'
                      : 'bg-white text-brand-navy/50 hover:bg-brand-navy/5 border border-brand-navy/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-brand-navy/5'
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
                  <div className="space-y-6">
                    {/* Bio / contact card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 shadow-xl">
                      <h3 className="text-lg font-bold mb-6 flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-brand-orange" />
                        Academic Profile
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          { label: 'Full Name', value: fullName, icon: <UserIcon className="w-4 h-4" /> },
                          { label: 'Email', value: email, icon: <Mail className="w-4 h-4" /> },
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
                          <button onClick={() => setActiveTab('projects')} className="text-[10px] text-brand-orange font-bold flex items-center">
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
                          <button onClick={() => setActiveTab('publications')} className="text-[10px] text-brand-orange font-bold flex items-center">
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
                )}

                {/* PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold flex items-center">
                        <BookOpen className="w-6 h-6 mr-3 text-brand-orange" />
                        My Projects
                        <span className="ml-3 text-xs font-bold text-brand-navy/30 bg-brand-navy/5 px-3 py-1 rounded-full">{projects.length}</span>
                      </h3>
                      <button
                        onClick={() => setModal('project')}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Project</span>
                      </button>
                    </div>

                    {projects.length === 0 ? (
                      <div className="bg-white p-16 rounded-[3rem] border border-brand-navy/5 text-center">
                        <BookOpen className="w-12 h-12 text-brand-navy/10 mx-auto mb-4" />
                        <p className="text-brand-navy/30 font-sans mb-6">You haven't initiated any research projects yet.</p>
                        <button
                          onClick={() => setModal('project')}
                          className="px-6 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                        >
                          Create Your First Project
                        </button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {projects.map((project) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 hover:border-brand-orange/20 transition-all group relative"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                  project.visibility === 'PUBLIC' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {project.visibility === 'PUBLIC' ? <Eye className="w-3 h-3 inline mr-1" /> : <EyeOff className="w-3 h-3 inline mr-1" />}
                                  {project.visibility}
                                </span>
                                <StatusBadge status={project.status} />
                              </div>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </div>

                            <h4 className="text-lg font-bold mb-3 group-hover:text-brand-orange transition-colors">
                              {project.title}
                            </h4>
                            <p className="text-brand-navy/50 text-xs line-clamp-2 mb-4 font-sans leading-relaxed">
                              {project.description}
                            </p>

                            <div className="pt-4 border-t border-brand-navy/5 flex justify-between items-center">
                              <div className="flex items-center space-x-1 text-[10px] text-brand-navy/30 font-bold uppercase tracking-widest">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(project.created_at)}</span>
                              </div>
                              {project.accepting_collaborators && (
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                  Accepting Collaborators
                                </span>
                              )}
                            </div>

                            {project.decision_note && (
                              <div className="mt-3 p-3 bg-brand-navy/2 rounded-xl">
                                <p className="text-[10px] text-brand-navy/40 font-medium">{project.decision_note}</p>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PUBLICATIONS TAB */}
                {activeTab === 'publications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold flex items-center">
                        <BookMarked className="w-6 h-6 mr-3 text-brand-orange" />
                        Publications
                        <span className="ml-3 text-xs font-bold text-brand-navy/30 bg-brand-navy/5 px-3 py-1 rounded-full">{publications.length}</span>
                      </h3>
                      <button
                        onClick={() => setModal('publication')}
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
                          onClick={() => setModal('publication')}
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
                                  onClick={() => handleDeletePublication(pub.id)}
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
                )}

                {/* CV TAB */}
                {activeTab === 'cv' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-brand-orange" />
                        My CVs
                        <span className="ml-3 text-xs font-bold text-brand-navy/30 bg-brand-navy/5 px-3 py-1 rounded-full">{cvList.length}</span>
                      </h3>
                      <button
                        onClick={() => setModal('cv')}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload CV</span>
                      </button>
                    </div>

                    {cvList.length === 0 ? (
                      <div className="bg-white p-16 rounded-[3rem] border border-brand-navy/5 text-center">
                        <FileText className="w-12 h-12 text-brand-navy/10 mx-auto mb-4" />
                        <p className="text-brand-navy/30 font-sans mb-6">No CVs uploaded yet.</p>
                        <button
                          onClick={() => setModal('cv')}
                          className="px-6 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                        >
                          Upload Your CV
                        </button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {cvList.map((cv) => (
                          <motion.div
                            key={cv.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 hover:border-brand-orange/20 transition-all group relative"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-brand-orange" />
                              </div>
                              <button
                                onClick={() => handleDeleteCV(cv.id)}
                                className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </div>

                            <h4 className="text-lg font-bold mb-1 group-hover:text-brand-orange transition-colors">{cv.title}</h4>
                            <p className="text-xs text-brand-navy/40 mb-4">{cv.university} · {cv.level} in {cv.major}</p>

                            {cv.bio && (
                              <p className="text-xs text-brand-navy/50 line-clamp-2 mb-4 font-sans leading-relaxed">{cv.bio}</p>
                            )}

                            <div className="space-y-2">
                              {cv.research_interests && (
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 mb-1">Research Interests</p>
                                  <p className="text-xs text-brand-navy/60 line-clamp-1">{cv.research_interests}</p>
                                </div>
                              )}
                              {cv.skills && (
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/30 mb-1">Skills</p>
                                  <p className="text-xs text-brand-navy/60 line-clamp-1">{cv.skills}</p>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-brand-navy/5 flex items-center justify-between">
                              <span className="text-[10px] text-brand-navy/30 font-bold uppercase tracking-widest">
                                {formatDate(cv.created_at)}
                              </span>
                              {cv.cv_url && (
                                <a
                                  href={cv.cv_url}
                                  target="_blank" rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-xs font-bold text-brand-orange hover:opacity-70 transition-all"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>View CV</span>
                                </a>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center">
                      <Settings className="w-6 h-6 mr-3 text-brand-orange" />
                      Settings
                    </h3>

                    {/* Settings sub-tabs */}
                    <div className="bg-white rounded-[2.5rem] border border-brand-navy/5 shadow-xl overflow-hidden">
                      <div className="flex border-b border-brand-navy/5">
                        {[
                          { id: 'profile' as const, label: 'Profile', icon: <UserIcon className="w-4 h-4" /> },
                          { id: 'notifications' as const, label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
                          { id: 'privacy' as const, label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
                          { id: 'appearance' as const, label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSettingsTab(t.id)}
                            className={`flex-1 flex items-center justify-center space-x-2 py-4 text-xs font-bold transition-all ${
                              settingsTab === t.id
                                ? 'border-b-2 border-brand-orange text-brand-orange'
                                : 'text-brand-navy/40 hover:text-brand-navy/70'
                            }`}
                          >
                            {t.icon}
                            <span className="hidden sm:inline">{t.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="p-8">
                        {settingsTab === 'profile' && (
                          <div className="space-y-5">
                            <p className="text-sm text-brand-navy/50 mb-6">Update your public profile information.</p>
                            <div className="grid md:grid-cols-2 gap-5">
                              {[
                                { label: 'Full Name', name: 'full_name', placeholder: 'Dr. Jane Doe' },
                                { label: 'Contact Email', name: 'contact_email', placeholder: 'contact@example.com', type: 'email' },
                                { label: 'Institution', name: 'institution', placeholder: 'University of ...' },
                                { label: 'Department', name: 'department', placeholder: 'Computer Science' },
                                { label: 'Phone Number', name: 'phone_number', placeholder: '+1 234 567 890' },
                                { label: 'Website', name: 'website', placeholder: 'https://yoursite.com' },
                              ].map((f) => (
                                <Field
                                  key={f.name}
                                  label={f.label}
                                  name={f.name}
                                  value={(settingsForm as any)[f.name]}
                                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                                  type={f.type}
                                  placeholder={f.placeholder}
                                />
                              ))}
                            </div>
                            <Field
                              label="Address"
                              name="address"
                              value={settingsForm.address}
                              onChange={(e) => setSettingsForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                              placeholder="City, Country"
                            />
                            <button
                              onClick={handleSaveSettings}
                              disabled={submitting}
                              className="flex items-center space-x-2 px-6 py-3 bg-brand-orange text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                              <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                          </div>
                        )}

                        {settingsTab === 'notifications' && (
                          <div className="space-y-4">
                            <p className="text-sm text-brand-navy/50 mb-6">Manage how you receive notifications.</p>
                            {[
                              { label: 'Project updates', desc: 'Get notified when your project status changes' },
                              { label: 'New collaborators', desc: 'When someone requests to join your project' },
                              { label: 'Publication mentions', desc: 'When your publications are cited or mentioned' },
                              { label: 'Weekly digest', desc: 'Weekly summary of your research activity' },
                            ].map(({ label, desc }) => (
                              <div key={label} className="flex items-center justify-between p-4 rounded-xl border border-brand-navy/5 hover:bg-brand-navy/2 transition-all">
                                <div>
                                  <p className="text-sm font-bold">{label}</p>
                                  <p className="text-xs text-brand-navy/40">{desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-10 h-5 bg-brand-navy/10 rounded-full peer peer-checked:bg-brand-orange transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                                </label>
                              </div>
                            ))}
                          </div>
                        )}

                        {settingsTab === 'privacy' && (
                          <div className="space-y-4">
                            <p className="text-sm text-brand-navy/50 mb-6">Control your visibility and data settings.</p>
                            {[
                              { label: 'Public profile', desc: 'Make your profile visible to other researchers' },
                              { label: 'Show email', desc: 'Display your contact email on your profile' },
                              { label: 'Searchable', desc: 'Allow others to find you via search' },
                              { label: 'Show publications', desc: 'Display your publications publicly' },
                            ].map(({ label, desc }) => (
                              <div key={label} className="flex items-center justify-between p-4 rounded-xl border border-brand-navy/5 hover:bg-brand-navy/2 transition-all">
                                <div>
                                  <p className="text-sm font-bold">{label}</p>
                                  <p className="text-xs text-brand-navy/40">{desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-10 h-5 bg-brand-navy/10 rounded-full peer peer-checked:bg-brand-orange transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                                </label>
                              </div>
                            ))}
                            <div className="mt-8 p-4 rounded-xl border border-red-100 bg-red-50">
                              <p className="text-sm font-bold text-red-600 mb-1">Danger Zone</p>
                              <p className="text-xs text-red-400 mb-3">Permanently delete your account and all associated data.</p>
                              <button className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-all">
                                Delete Account
                              </button>
                            </div>
                          </div>
                        )}

                        {settingsTab === 'appearance' && (
                          <div className="space-y-4">
                            <p className="text-sm text-brand-navy/50 mb-6">Customize your dashboard appearance.</p>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 mb-3">Theme</p>
                              <div className="grid grid-cols-3 gap-3">
                                {['Light', 'Dark', 'System'].map((t) => (
                                  <button
                                    key={t}
                                    className={`p-4 rounded-xl border text-xs font-bold transition-all ${
                                      t === 'Light'
                                        ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                                        : 'border-brand-navy/10 text-brand-navy/50 hover:border-brand-navy/20'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 mb-3">Default Tab</p>
                              <div className="grid grid-cols-2 gap-2">
                                {(['overview', 'projects', 'publications', 'cv'] as ActiveTab[]).map((t) => (
                                  <button
                                    key={t}
                                    className="p-3 rounded-xl border border-brand-navy/10 text-xs font-bold text-brand-navy/50 hover:border-brand-orange/30 transition-all capitalize"
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
