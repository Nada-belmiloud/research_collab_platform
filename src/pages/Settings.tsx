import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, Mail, Monitor, Languages, Save, Shield, User as UserIcon } from 'lucide-react';
import api from '../services/api';
import { UserSettings } from '../types';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get<UserSettings>('/settings/');
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    if (!settings) return;
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/settings/', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update settings', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-brand-navy mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and notification settings.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-brand-navy text-white rounded-xl font-bold transition-all">
            <UserIcon size={18} /> Account
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-all">
            <Shield size={18} /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-all">
            <Bell size={18} /> Notifications
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Notifications Section */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
              <Bell className="text-brand-orange" size={20} /> Notification Preferences
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive updates about your applications via email.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings?.email_notifications}
                    onChange={(e) => setSettings(s => s ? { ...s, email_notifications: e.target.checked } : null)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">App Notifications</p>
                    <p className="text-xs text-gray-500">Enable in-app alerts and browser notifications.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings?.app_notifications}
                    onChange={(e) => setSettings(s => s ? { ...s, app_notifications: e.target.checked } : null)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
              <Monitor className="text-brand-navy" size={20} /> Appearance
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSettings(s => s ? { ...s, theme: 'light' } : null)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  settings?.theme === 'light' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="w-full h-20 bg-gray-50 rounded-lg mb-3 border border-gray-100"></div>
                <p className="font-bold text-sm text-brand-navy">Light Mode</p>
              </button>
              <button
                onClick={() => setSettings(s => s ? { ...s, theme: 'dark' } : null)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  settings?.theme === 'dark' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="w-full h-20 bg-gray-900 rounded-lg mb-3 border border-gray-800"></div>
                <p className="font-bold text-sm text-brand-navy">Dark Mode</p>
              </button>
            </div>
          </section>

          {/* Language Section */}
          <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
              <Languages className="text-brand-teal" size={20} /> Language
            </h2>
            <select
              value={settings?.language}
              onChange={(e) => setSettings(s => s ? { ...s, language: e.target.value } : null)}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all font-medium"
            >
              <option value="en">English (US)</option>
              <option value="fr">Français (FR)</option>
              <option value="es">Español (ES)</option>
              <option value="ar">العربية (AR)</option>
            </select>
          </section>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4">
            <p className={`text-sm font-medium transition-opacity ${success ? 'text-green-600 opacity-100' : 'opacity-0'}`}>
              Settings saved successfully!
            </p>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="flex items-center gap-2 bg-brand-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-teal transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
