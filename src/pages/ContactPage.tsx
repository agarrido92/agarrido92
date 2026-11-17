import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Send, ShieldAlert, CheckCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { navigateTo, currentUser } = useApp();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          We Want to Hear From You!
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Have questions or feedback for the ECU School of Theatre and Dance administrators? Reach out below.
        </p>
      </div>

      {/* Figure 12 Contact Us Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative">
        {submitted ? (
          <div className="text-center py-12 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Sent!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thank you for contacting the ECU Performer Connect admin team. We will review your message promptly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
                setSubject('');
              }}
              className="mt-4 px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your-name@students.ecu.edu"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject:
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Inquiry or technical feedback"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message:
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>

              {/* Figure 12 Label #7: Report User Button */}
              <div className="text-right w-full sm:w-auto">
                <span className="text-[11px] text-slate-500 block">Need to report inappropriate content or behavior?</span>
                <button
                  type="button"
                  onClick={() => navigateTo('report-user')}
                  className="mt-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Report User</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
