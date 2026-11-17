import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Paperclip, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ReportUserPage: React.FC = () => {
  const { submitReport, navigateTo, currentUser } = useApp();

  // Figure 35 Dropdowns & inputs
  const [targetType, setTargetType] = useState<'User/Profile' | 'Casting Call' | 'Message' | 'Other Content'>('User/Profile');
  const [personReported, setPersonReported] = useState('');
  const [reason, setReason] = useState<'Harassment/Bullying' | 'Inappropriate Content' | 'Spam' | 'Impersonation' | 'Discrimination' | 'Other'>('Inappropriate Content');
  const [description, setDescription] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personReported.trim() || !description.trim()) return;

    submitReport({
      reporterId: currentUser?.id || 'guest',
      targetType,
      targetEntityName: personReported.trim(),
      reason,
      description: description.trim(),
      attachmentName: attachedFileName || undefined,
    });

    setIsSubmitted(true);
  };

  const handleSimulateAttach = () => {
    setAttachedFileName('screenshot_report_evidence.png');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={() => navigateTo('home')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[var(--color-primary)] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Figure 35: Report User Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Report User</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Use this form to report inappropriate content or behavior.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Report Submitted to Administration</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Thank you for keeping ECU Performer Connect a safe and professional space. School of Theatre & Dance administrators will review this incident shortly.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('home')}
                className="px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Figure 35 Label #1: What are you reporting? Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                What are you reporting?
              </label>
              <select
                value={targetType}
                onChange={e => setTargetType(e.target.value as any)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary"
              >
                <option value="User/Profile">User/Profile</option>
                <option value="Casting Call">Casting Call</option>
                <option value="Message">Message</option>
                <option value="Other Content">Other Content</option>
              </select>
            </div>

            {/* Figure 35 Label #2: Person/Project/Content in Question */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Person / Project / Content in Question: *
              </label>
              <input
                type="text"
                required
                value={personReported}
                onChange={e => setPersonReported(e.target.value)}
                placeholder="Name of user, profile URL, or casting call title"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
              />
            </div>

            {/* Figure 35 Label #3: Reason for Report */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Report:
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as any)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary"
              >
                <option value="Harassment/Bullying">Harassment / Bullying</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Spam">Spam</option>
                <option value="Impersonation">Impersonation</option>
                <option value="Discrimination">Discrimination</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Figure 35 Label #4: Description of Report */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description of Report: *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide detailed context regarding the misconduct or policy violation..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
              />
            </div>

            {/* Figure 35 Label #5 & #6: Attach Files and Send Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {/* Label #5: Attach Files Button */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSimulateAttach}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition"
                >
                  <Paperclip className="w-4 h-4 text-slate-400" />
                  <span>{attachedFileName ? 'File Attached' : 'Attach Files'}</span>
                </button>
                {attachedFileName && (
                  <span className="text-[11px] text-emerald-600 font-mono font-semibold">
                    {attachedFileName}
                  </span>
                )}
              </div>

              {/* Label #6: Send Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Send Report</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
