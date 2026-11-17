import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';
import { Application } from '../types';

export const MyApplicationsPage: React.FC = () => {
  const { applications, currentUser, updateApplicationDecision, navigateTo } = useApp();

  // Figure 29 Label #1: Status Dropdown
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal to handle Action Required
  const [activeActionApp, setActiveActionApp] = useState<Application | null>(null);
  const [actionCompleteModal, setActionCompleteModal] = useState(false);
  const [submissionTapeUrl, setSubmissionTapeUrl] = useState('');

  const userApps = useMemo(() => {
    let list = applications.filter(a => a.performer_id === currentUser?.id);
    if (statusFilter !== 'All') {
      list = list.filter(a => a.status === statusFilter);
    }
    return list;
  }, [applications, currentUser, statusFilter]);

  const handleCompleteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionApp) return;

    // Resolve action required
    updateApplicationDecision(
      activeActionApp.id,
      activeActionApp.decision,
      activeActionApp.currentWorkflowStage,
      'In Review',
      null // cleared action required
    );

    setActiveActionApp(null);
    setActionCompleteModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Applications</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your audition submissions, callback schedules, and casting notifications.
          </p>
        </div>

        {/* Figure 29 Label #1: Status Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-xs font-semibold text-slate-500">Status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="In Review">In Review</option>
            <option value="Callback">Callback</option>
            <option value="Final Audition">Final Audition</option>
            <option value="Accepted">Accepted / Cast</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Figure 29 Label #2: Applications List */}
      <div className="space-y-4">
        {userApps.length > 0 ? (
          userApps.map(app => {
            const hasAction = Boolean(app.actionRequired);

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {app.castingCallTitle}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                      Role: <span className="text-[var(--color-primary)] font-bold">{app.characterName}</span> • Submitted {app.submissionDate}
                    </p>
                  </div>

                  {/* Figure 29 Label #3: Action Notification */}
                  <div className="flex items-center gap-2">
                    {hasAction && (
                      <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold tracking-wide animate-pulse">
                        ACTION REQUIRED
                      </span>
                    )}

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : app.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : app.status === 'Callback' || app.status === 'Final Audition'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Workflow Stepper */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-slate-400">Current Stage:</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md ${app.currentWorkflowStage === 'Application' ? 'bg-[var(--color-primary)] text-white' : 'text-emerald-600'}`}>
                        ✓ Application
                      </span>
                      <span className="text-slate-300">→</span>
                      <span className={`px-2 py-0.5 rounded-md ${app.currentWorkflowStage === 'Callback' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-500'}`}>
                        ● Callback
                      </span>
                      <span className="text-slate-300">→</span>
                      <span className={`px-2 py-0.5 rounded-md ${app.currentWorkflowStage === 'Final Audition' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-500'}`}>
                        ○ Final Audition
                      </span>
                    </div>
                  </div>

                  {/* Figure 29 Label #4: View & Complete Button */}
                  {hasAction ? (
                    <button
                      onClick={() => setActiveActionApp(app)}
                      className="px-4 py-2 rounded-xl btn-primary text-xs font-bold shadow-md hover:scale-102 transition flex items-center gap-1.5"
                    >
                      <span>View & Complete</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      Your application is currently being reviewed.
                    </span>
                  )}
                </div>

                {/* Action Required Callout Box if present */}
                {hasAction && app.actionRequired && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Next Step Requirement:</span>
                      <p className="mt-0.5">{app.actionRequired.message}</p>
                      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 mt-1 block">
                        Due Date: {app.actionRequired.deadline}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white">No Applications</h3>
            <p className="text-xs text-slate-500 mt-1">
              You haven&apos;t applied to any casting calls matching &quot;{statusFilter}&quot;.
            </p>
            <button
              onClick={() => navigateTo('casting-calls')}
              className="mt-4 px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
            >
              Browse Active Auditions
            </button>
          </div>
        )}
      </div>

      {/* View & Complete Action Modal */}
      {activeActionApp && activeActionApp.actionRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setActiveActionApp(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-full">
              Action Required
            </span>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
              {activeActionApp.castingCallTitle}
            </h2>
            <p className="text-xs text-slate-500">Role: {activeActionApp.characterName}</p>

            <div className="my-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
              <p className="font-bold mb-1">Director Instructions:</p>
              <p>{activeActionApp.actionRequired.message}</p>
              <p className="mt-2 text-[11px] font-semibold text-amber-700">
                Deadline: {activeActionApp.actionRequired.deadline}
              </p>
            </div>

            <form onSubmit={handleCompleteAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Submission / Callback Response Reel Link:
                </label>
                <input
                  type="text"
                  required
                  value={submissionTapeUrl}
                  onChange={e => setSubmissionTapeUrl(e.target.value)}
                  placeholder="https://commondatastorage.googleapis.com/... or Vimeo link"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveActionApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold shadow-md"
                >
                  Confirm & Submit Callback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Toast / Modal */}
      {actionCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Action Completed!</h3>
            <p className="text-xs text-slate-500">
              Your callback materials were dispatched to the casting directors for review.
            </p>
            <button
              onClick={() => setActionCompleteModal(false)}
              className="mt-3 px-5 py-2 rounded-xl btn-primary text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
