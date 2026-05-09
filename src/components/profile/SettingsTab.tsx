import React from 'react';
import { 
  Settings as SettingsIcon, Bell, Shield, Palette, Eye, EyeOff, Save,
  User as UserIcon, Mail, Phone, Building, GraduationCap, MapPin, Globe
} from 'lucide-react';

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  institution: string | null;
  department: string | null;
  contact_email: string | null;
  phone_number: string | null;
  address: string | null;
  website: string | null;
}

interface SettingsTabProps {
  profile: UserProfile | null;
  settingsForm: any;
  onSettingsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSaveSettings: (e: React.FormEvent) => void;
  isSaving: boolean;
  Field: React.FC<any>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  profile,
  settingsForm,
  onSettingsChange,
  onSaveSettings,
  isSaving,
  Field,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <SettingsIcon className="w-6 h-6 mr-3 text-brand-orange" />
          Account Settings
        </h3>
        <button
          onClick={onSaveSettings}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-3 bg-brand-navy text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Navigation for settings sections */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Profile Information', icon: <UserIcon className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { id: 'privacy', label: 'Privacy & Security', icon: <Shield className="w-4 h-4" /> },
            { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
          ].map((section) => (
            <button
              key={section.id}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                section.id === 'profile' ? 'bg-brand-orange text-white shadow-lg' : 'text-brand-navy/40 hover:bg-brand-navy/5'
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Settings form content */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 shadow-xl space-y-8">
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4">Personal Details</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Full Name" name="full_name" value={settingsForm.full_name} onChange={onSettingsChange} required />
              <Field label="Email Address" name="email" value={settingsForm.email} onChange={onSettingsChange} required type="email" />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4">Institutional Affiliation</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Institution" name="institution" value={settingsForm.institution} onChange={onSettingsChange} />
              <Field label="Department" name="department" value={settingsForm.department} onChange={onSettingsChange} />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4">Contact Information</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Contact Email" name="contact_email" value={settingsForm.contact_email} onChange={onSettingsChange} type="email" />
              <Field label="Phone Number" name="phone_number" value={settingsForm.phone_number} onChange={onSettingsChange} type="tel" />
              <div className="md:col-span-2">
                <Field label="Address" name="address" value={settingsForm.address} onChange={onSettingsChange} textarea />
              </div>
              <div className="md:col-span-2">
                <Field label="Personal Website" name="website" value={settingsForm.website} onChange={onSettingsChange} placeholder="https://example.com" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
