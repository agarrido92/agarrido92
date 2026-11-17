import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoleType } from '../types';
import { TwoFactorModal } from '../components/TwoFactorModal';
import { UserPlus, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, navigateTo } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roles, setRoles] = useState<RoleType[]>(['Performer']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  const toggleRole = (role: RoleType) => {
    if (roles.includes(role)) {
      if (roles.length > 1) {
        setRoles(roles.filter(r => r !== role));
      }
    } else {
      setRoles([...roles, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    // SRS Figure 15 & System Policy: Faculty are created manually by admin; no @ecu.edu allowed at public registration
    if (cleanEmail.endsWith('@ecu.edu')) {
      setError('Faculty accounts are added manually by the department administrator. Self-registration is restricted to students with an @students.ecu.edu email address.');
      return;
    }

    if (!cleanEmail.endsWith('@students.ecu.edu')) {
      setError('Registration restricted (Figure 15): Only @students.ecu.edu email addresses are allowed.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await register({
      firstName,
      lastName,
      email: cleanEmail,
      password,
      confirmPassword,
      roles,
      classification: 'Student', // Self-registered accounts are always students
    });
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
    <div className="max-w-lg mx-auto px-4 py-10 animate-in fade-in">
      {/* Figure 15: Create Account */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-[#E8E7E3] dark:border-slate-700 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Student registration for ECU Performer Connect
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label #2: First Name and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
              />
            </div>
          </div>

          {/* Label #3: Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. pirate26@students.ecu.edu"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Validation: Only <strong>@students.ecu.edu</strong> emails are allowed. Faculty accounts are added manually by department administrators.
            </p>
          </div>

          {/* Role selection (SRS Section III.C: Performer, Director, or Both) */}
          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Primary Role (select one or both)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toggleRole('Performer')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  roles.includes('Performer')
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900'
                }`}
              >
                <input
                  type="checkbox"
                  checked={roles.includes('Performer')}
                  onChange={() => {}}
                  className="rounded text-[var(--color-primary)]"
                />
                <span>Performer / Actor</span>
              </button>

              <button
                type="button"
                onClick={() => toggleRole('Director')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  roles.includes('Director')
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900'
                }`}
              >
                <input
                  type="checkbox"
                  checked={roles.includes('Director')}
                  onChange={() => {}}
                  className="rounded text-[var(--color-primary)]"
                />
                <span>Director / Producer</span>
              </button>
            </div>
          </div>

          {/* Label #4: Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
            />
          </div>

          {/* Label #5: Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-primary text-sm font-semibold shadow-sm disabled:opacity-50 transition"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          {/* Label #6: Already have an account? Login */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="font-bold text-[var(--color-primary)] hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>

      <TwoFactorModal
        isOpen={show2FA}
        onClose={() => setShow2FA(false)}
        onSuccess={handle2FASuccess}
        userEmail={email}
      />
    </div>
  );
};
