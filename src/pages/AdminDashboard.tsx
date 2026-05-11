import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Beaker, FolderKanban, BookOpen, FileText, 
  AlertCircle, TrendingUp, RefreshCw, Download, 
  Plus, Search, Edit2, Trash2, Shield, LayoutDashboard,
  ArrowUpRight, Mail, Building
} from 'lucide-react';
import { adminService, labService } from '../services/api';
import { AnalyticsResponse, UserProfile, ResearchLab } from '../types';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

type AdminTab = 'analytics' | 'users' | 'labs';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [stats, setStats] = useState<AnalyticsResponse | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [labs, setLabs] = useState<ResearchLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [labSearch, setLabSearch] = useState('');

  // Modals
  const [showUserModal, setShowUserModal] = useState<UserProfile | null>(null);
  const [showLabModal, setShowLabModal] = useState<ResearchLab | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [labForm, setLabForm] = useState({ name: '', description: '', location: '', website_url: '' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, labsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ limit: 100 }),
        labService.getAll()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.items);
      setLabs(labsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is permanent.')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleUpdateUserRole = async (user: UserProfile, newRole: string) => {
    try {
      await adminService.updateUser(user.id, { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleLabSubmit = async () => {
    try {
      setSubmitting(true);
      if (showLabModal?.id) {
        const res = await labService.update(showLabModal.id, labForm);
        setLabs(prev => prev.map(l => l.id === showLabModal.id ? res.data : l));
      } else {
        const res = await labService.create(labForm);
        setLabs(prev => [...prev, res.data]);
      }
      setShowLabModal(null);
    } catch (err) {
      alert('Failed to save lab');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLab = async (id: number) => {
    if (!window.confirm('Delete this institution? All associated data will be archived.')) return;
    try {
      await labService.delete(id);
      setLabs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      alert('Failed to delete lab');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RefreshCw className="w-8 h-8 text-brand-orange animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-gray-50/30">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-navy/40 mb-2">
            <Shield size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Administrative Control</span>
          </div>
          <h1 className="text-4xl font-bold text-brand-navy tracking-tight">System Terminal</h1>
          <p className="text-sm text-gray-500 mt-1">Manage users, research labs, and platform analytics.</p>
        </div>

        <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'analytics' ? 'bg-brand-navy text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={14} /> Analytics
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-brand-navy text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Users size={14} /> Users
          </button>
          <button 
            onClick={() => setActiveTab('labs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'labs' ? 'bg-brand-navy text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Beaker size={14} /> Labs
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'analytics' && stats && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats.stats.total_users, icon: Users, color: 'text-blue-500' },
                { label: 'Research Labs', value: stats.stats.total_labs, icon: Beaker, color: 'text-brand-teal' },
                { label: 'Active Projects', value: stats.stats.total_projects, icon: FolderKanban, color: 'text-brand-orange' },
                { label: 'Applications', value: stats.stats.total_applications, icon: FileText, color: 'text-brand-navy' },
              ].map((card) => (
                <Card key={card.label} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg bg-gray-50 ${card.color}`}>
                      <card.icon size={20} />
                    </div>
                    <Badge variant="info" className="scale-75 origin-right">+12%</Badge>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                  <h3 className="text-2xl font-bold text-brand-navy mt-1">{card.value}</h3>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                    <TrendingUp size={18} className="text-brand-teal" /> Platform Growth
                  </h3>
                  <Button variant="ghost" size="sm" onClick={handleRefresh} isLoading={refreshing} leftIcon={<RefreshCw size={14} />}>Sync</Button>
                </div>
                <div className="h-48 flex items-end gap-2 px-2">
                  {stats.user_growth.map((point) => {
                    const max = Math.max(...stats.user_growth.map(p => p.count));
                    const height = (point.count / max) * 100;
                    return (
                      <div key={point.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} className="w-full max-w-[30px] bg-brand-teal/20 group-hover:bg-brand-teal rounded-t-md transition-colors" />
                        <span className="text-[9px] text-gray-400 font-bold mt-2 rotate-45 origin-left whitespace-nowrap">{point.date.split('-').slice(1).join('/')}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="text-lg font-bold text-brand-navy mb-8 flex items-center gap-2">
                  <FileText size={18} className="text-brand-orange" /> Critical Metrics
                </h3>
                <div className="space-y-6">
                  {[
                    { label: 'Accepted Applications', value: 64, color: 'bg-green-500' },
                    { label: 'Pending Review', value: 22, color: 'bg-amber-500' },
                    { label: 'Rejected', value: 14, color: 'bg-red-500' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-brand-navy">{item.label}</span>
                        <span className="text-gray-400">{item.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} className={`h-full ${item.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>Export</Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <th className="px-6 py-4">Identity</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Institution</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.filter(u => u.full_name.toLowerCase().includes(userSearch.toLowerCase())).map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-navy/5 rounded-lg flex items-center justify-center font-bold text-brand-navy text-xs">
                              {user.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-brand-navy">{user.full_name}</p>
                              <p className="text-[10px] text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={user.role} 
                            onChange={(e) => handleUpdateUserRole(user, e.target.value)}
                            className="bg-transparent border-none text-[10px] font-black uppercase tracking-wider text-brand-orange focus:ring-0 cursor-pointer"
                          >
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="ADMIN">Admin</option>
                            <option value="PARTNER">Partner</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">{user.institution || '—'}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'labs' && (
          <motion.div key="labs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex justify-between items-center mb-8">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="Filter research institutions..."
                  value={labSearch}
                  onChange={(e) => setLabSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all shadow-sm"
                />
              </div>
              <Button 
                onClick={() => { setLabForm({ name: '', description: '', location: '', website_url: '' }); setShowLabModal({} as any); }}
                variant="primary" 
                leftIcon={<Plus size={16} />}
              >
                Register Lab
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labs.filter(l => l.name.toLowerCase().includes(labSearch.toLowerCase())).map((lab) => (
                <Card key={lab.id} className="p-6 group relative">
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => { setLabForm({ name: lab.name, description: lab.description, location: lab.location || '', website_url: lab.website_url || '' }); setShowLabModal(lab); }}
                      className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-brand-orange hover:shadow-md transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteLab(lab.id)}
                      className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 hover:shadow-md transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="w-12 h-12 bg-brand-navy/5 rounded-xl flex items-center justify-center text-brand-navy mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all">
                    <Building size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-brand-navy mb-2">{lab.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-6 font-light">{lab.description}</p>
                  
                  <div className="pt-4 border-t border-gray-50 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      <Mail size={12} /> info@{lab.name.toLowerCase().replace(/\s/g, '')}.edu
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lab Modal */}
      <Modal 
        isOpen={!!showLabModal} 
        onClose={() => setShowLabModal(null)} 
        title={showLabModal?.id ? 'Edit Institution' : 'Register New Institution'}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <Input label="Institution Name" value={labForm.name} onChange={(e) => setLabForm({...labForm, name: e.target.value})} />
          <Input label="Description" textarea value={labForm.description} onChange={(e) => setLabForm({...labForm, description: e.target.value})} />
          <Input label="Campus / Location" value={labForm.location} onChange={(e) => setLabForm({...labForm, location: e.target.value})} />
          <Input label="Web Presence (URL)" value={labForm.website_url} onChange={(e) => setLabForm({...labForm, website_url: e.target.value})} />
          <Button onClick={handleLabSubmit} className="w-full" isLoading={submitting}>
            {showLabModal?.id ? 'Update Registry' : 'Initialize Lab'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
