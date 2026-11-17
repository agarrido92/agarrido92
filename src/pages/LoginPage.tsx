import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TwoFactorModal } from '../components/TwoFactorModal';
import { LogIn, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@ecu.edu') && !cleanEmail.endsWith('@students.ecu.edu')) {
      setError('Access restricted (FR-001): Please enter an official ECU address ending in @students.ecu.edu or @ecu.edu');
      return;
    }

    setLoading(true);
    const res = await login(cleanEmail);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.requires2FA) {
      setShow2FA(true);
    }
  };

  const handle2FASuccess = () => {
    setShow2FA(false);
    navigateTo('home');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {/* Figure 14: Login Page */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Login</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Log in to your ECU account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. linm22@students.ecu.edu or jonesau@ecu.edu"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Must be an official @students.ecu.edu or @ecu.edu address.
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="text-[11px] text-[var(--color-primary)] hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-primary text-sm font-semibold shadow-md disabled:opacity-50 transition"
            >
              {loading ? 'Authenticating...' : 'Log In'}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('register')}
                className="font-bold text-[var(--color-primary)] hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </form>

        {/* Demo Fast Login Helpers */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60">
          <p className="text-[11px] text-slate-400 font-medium mb-2 text-center">Fast Demo Logins:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail('linm22@students.ecu.edu');
                setPassword('Pirates2026!');
              }}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-left truncate"
            >
              <span className="font-semibold block truncate">Maya Lin (Student)</span>
              <span className="text-[10px] text-slate-400 block truncate">linm22@students.ecu.edu</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('jonesau@ecu.edu');
                setPassword('Pirates2026!');
              }}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-left truncate"
            >
              <span className="font-semibold block truncate">Prof. Jones (Admin)</span>
              <span className="text-[10px] text-slate-400 block truncate">jonesau@ecu.edu</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2FA Modal */}
      <TwoFactorModal
        isOpen={show2FA}
        onClose={() => setShow2FA(false)}
        onSuccess={handle2FASuccess}
        userEmail={email}
      />

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">ECU Single Sign-On / Reset</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Password resets for official ECU accounts are managed through the ECU ITCS Passphrase Portal (pirateid.ecu.edu). A reset link can also be forwarded to your campus mailbox.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setForgotModal(false)}
                className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
