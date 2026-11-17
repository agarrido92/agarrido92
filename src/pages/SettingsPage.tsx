import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ColorTheme, DisplayMode } from '../types';
import {
  Palette,
  Bell,
  UserCheck,
  Shield,
  Save,
  CheckCircle2,
  Trash2,
  Key,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, currentUser, logout, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'account'>('appearance');

  // Appearance Form State (Figure 16)
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(settings.colorTheme);
  const [selectedDisplay, setSelectedDisplay] = useState<DisplayMode>(settings.displayMode);

  // Notifications Form State (Figure 17)
  const [messageNotifs, setMessageNotifs] = useState(settings.messageNotifications);
  const [emailNotifs, setEmailNotifs] = useState(settings.emailNotifications);

  // Account Form State (Figure 18)
  const [isPrivateAccount, setIsPrivateAccount] = useState(settings.isPrivate);

  // Modals & Feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Palette details for visual picker & description
  const palettes = [
    {
      id: 'ecu' as ColorTheme,
      name: 'ECU Purple & Gold (Default)',
      description: 'Official East Carolina University Primary Brand Colors: Deep Royal Purple (#592A8A) & Radiant Pirate Gold (#FEC923).',
      primaryColor: '#592A8A',
      accentColor: '#FEC923',
    },
    {
      id: 'coastal' as ColorTheme,
      name: 'Coastal Carolina (Teal & Sky Blue)',
      description: 'Maritime coastal palette inspired by the Outer Banks and Atlantic coast. Refreshing Deep Teal (#0E7490) & Ocean Sky (#0284C7).',
      primaryColor: '#0E7490',
      accentColor: '#0284C7',
    },
    {
      id: 'emerald' as ColorTheme,
      name: 'Emerald Forest & Warm Amber',
      description: 'Earth & woodland theatrical tone. Rich Emerald Green (#15803D) & Warm Ochre Amber (#D97706).',
      primaryColor: '#15803D',
      accentColor: '#D97706',
    },
    {
      id: 'crimson' as ColorTheme,
      name: 'Stage Night (Crimson & Amber)',
      description: 'Dramatic velvet proscenium curtain tones. Rich Stage Crimson (#9F1239) & Spotlight Amber (#D97706).',
      primaryColor: '#9F1239',
      accentColor: '#D97706',
    },
  ];

  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      colorTheme: selectedTheme,
      displayMode: selectedDisplay,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      messageNotifications: messageNotifs,
      emailNotifications: emailNotifs,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      isPrivate: isPrivateAccount,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsChangePasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }, 1500);
  };

  const handleDeleteAccount = () => {
    alert('Account deleted in compliance with university privacy policies.');
    logout();
    navigateTo('home');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your appearance theme, communication preferences, and security settings.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Your settings changes have been saved and applied successfully!</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Figure 16 Label #1: Settings Navigation */}
        <div className="w-full md:w-56 bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'appearance'
                ? 'btn-primary shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'notifications'
                ? 'btn-primary shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'account'
                ? 'btn-primary shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Account</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* --- TAB 1: APPEARANCE (Figure 16) --- */}
          {activeTab === 'appearance' && (
            <form onSubmit={handleSaveAppearance} className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance & Branding</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Configure color theme palettes and display light/dark modes.
                </p>
              </div>

              {/* Figure 16 Label #2: Color Theme Dropdown & Swatch Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Color Theme (Default: ECU Purple & Gold):
                </label>
                <select
                  value={selectedTheme}
                  onChange={e => {
                    const val = e.target.value as ColorTheme;
                    setSelectedTheme(val);
                    updateSettings({ colorTheme: val });
                  }}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-semibold ring-theme-primary"
                >
                  <option value="ecu">ECU Purple & Gold (Default University Palette)</option>
                  <option value="coastal">Coastal Carolina (Teal & Sky Blue)</option>
                  <option value="emerald">Emerald Forest & Amber Gold</option>
                  <option value="crimson">Stage Night (Crimson & Spotlight Gold)</option>
                </select>

                {/* Visual Palette Preview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {palettes.map(p => {
                    const isSelected = selectedTheme === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedTheme(p.id);
                          updateSettings({ colorTheme: p.id });
                        }}
                        className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] shadow-xs'
                            : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: p.primaryColor }}
                              title="Primary Color"
                            />
                            <div
                              className="w-6 h-6 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: p.accentColor }}
                              title="Accent Color"
                            />
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-[var(--color-primary)] bg-white dark:bg-stone-800 px-2 py-0.5 rounded-full border border-[var(--color-primary-border)]">
                              Active
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-bold text-stone-900 dark:text-white block">{p.name}</span>
                        <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">{p.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Figure 16 Label #3: Display Dropdown (Dark, Light, System Default) */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Display Mode:
                </label>
                <select
                  value={selectedDisplay}
                  onChange={e => setSelectedDisplay(e.target.value as DisplayMode)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold ring-theme-primary"
                >
                  <option value="system">System Default</option>
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>

              {/* Figure 16 Label #4: Save Changes Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* --- TAB 2: NOTIFICATIONS (Figure 17) --- */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage in-app direct message alerts and official ECU email updates.
                </p>
              </div>

              <div className="space-y-4">
                {/* Figure 17 Label #1: Messages Notification Checkbox */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="msgNotif"
                    checked={messageNotifs}
                    onChange={e => setMessageNotifs(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[var(--color-primary)]"
                  />
                  <div>
                    <label htmlFor="msgNotif" className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block cursor-pointer">
                      Messages Notification
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Notify me when I receive a new message.
                    </p>
                  </div>
                </div>

                {/* Figure 17 Label #2: Email Notifications Checkbox */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="emailNotif"
                    checked={emailNotifs}
                    onChange={e => setEmailNotifs(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[var(--color-primary)]"
                  />
                  <div>
                    <label htmlFor="emailNotif" className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block cursor-pointer">
                      Email Notifications
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Send audition invitations, callback updates, and director notifications to my verified ECU email address.
                    </p>
                  </div>
                </div>
              </div>

              {/* Figure 17 Label #3: Save Changes Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* --- TAB 3: ACCOUNT & SECURITY (Figure 18) --- */}
          {activeTab === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account & Security</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage account email credentials, privacy mode, and university retention data.
                </p>
              </div>

              {/* Figure 18 Label #1: Email Text Field (Read-only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email (Read-only):
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentUser?.email || 'linm22@students.ecu.edu'}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Official university accounts cannot change their registered @ecu.edu address.
                </span>
              </div>

              {/* Figure 18 Label #2 & #3: Password & Change Password Button */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Password:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    readOnly
                    value="••••••••••••"
                    className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
                  />
                  {/* Label #3: Change Password Button */}
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Figure 18 Label #4: Account Private Checkbox */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privAcc"
                  checked={isPrivateAccount}
                  onChange={e => setIsPrivateAccount(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[var(--color-primary)]"
                />
                <div>
                  <label htmlFor="privAcc" className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block cursor-pointer">
                    Set account to private
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Others cannot see your profile in public performer/director search directories.
                  </p>
                </div>
              </div>

              {/* University Account Retention Notice (Requirements 4.5 & 4.6) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Account Retention Status:</p>
                <p className="text-slate-500">
                  Last login recorded: <strong>Just now</strong>. Your account is active. Inactive accounts are deactivated after 6 months and purged after 12 months in accordance with ECU ITCS security policy.
                </p>
              </div>

              {/* Figure 18 Label #5 & #6: Delete Account & Save Changes */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Label #5: Delete Account Button */}
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>

                {/* Label #6: Save Changes Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Change Account Password</h3>

            {passwordError && (
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs">
                Password updated successfully!
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl btn-primary text-xs font-semibold"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Trash2 className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete Account?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This action will permanently delete your profile, media reels, characteristics, and past applications. This cannot be undone.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
