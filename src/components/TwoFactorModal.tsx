import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KeyRound, ShieldCheck, AlertCircle, X } from 'lucide-react';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail: string;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ isOpen, onClose, onSuccess, userEmail }) => {
  const { verify2FA } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    const ok = await verify2FA(code.trim());
    setLoading(false);

    if (ok) {
      onSuccess();
    } else {
      setError('Invalid verification code. Please check your ECU email or use test code 252109.');
    }
  };

  const handleFillTestCode = () => {
    setCode('252109');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Security requirement FR-002: Please verify your identity. A 6-digit code was sent to{' '}
            <strong className="text-slate-700 dark:text-slate-300">{userEmail || 'your ECU email'}</strong>.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-center">
              Enter 6-Digit Passcode
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="••••••"
              autoFocus
              className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-slate-900 transition"
            />
          </div>

          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <span>Pirate Test Passcode: <strong>252109</strong></span>
            <button
              type="button"
              onClick={handleFillTestCode}
              className="text-xs font-bold underline hover:text-amber-900 dark:hover:text-amber-200 ml-2"
            >
              Auto-fill
            </button>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl btn-primary text-sm font-semibold shadow-md disabled:opacity-50 transition"
            >
              {loading ? 'Verifying...' : 'Verify & Log In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
