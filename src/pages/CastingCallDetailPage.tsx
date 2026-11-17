import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplyRoleModal } from '../components/ApplyRoleModal';
import { CharacterRole } from '../types';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Users,
  CheckCircle2,
  FileCheck,
  Clapperboard,
  Share2,
  Sparkles
} from 'lucide-react';

export const CastingCallDetailPage: React.FC<{ castingCallId: string }> = ({ castingCallId }) => {
  const { castingCalls, navigateTo, currentUser, applications } = useApp();

  const call = castingCalls.find(c => c.id === castingCallId) || castingCalls[0];
  const [selectedCharForApply, setSelectedCharForApply] = useState<CharacterRole | null>(null);
  const [applySuccessModal, setApplySuccessModal] = useState(false);

  const isDirectorOfCall = currentUser?.id === call.director_id || currentUser?.isAdmin;

  const appliedCharacterIds = applications
    .filter(a => a.casting_call_id === call.id && a.performer_id === currentUser?.id)
    .map(a => a.character_id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Figure 24 Label #1: Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('casting-calls')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[var(--color-primary)] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Casting Calls</span>
        </button>

        {isDirectorOfCall && (
          <button
            onClick={() => navigateTo('applicant-review', call.id)}
            className="px-4 py-2 rounded-xl btn-accent text-xs sm:text-sm font-bold shadow-sm flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage Applicant Pipeline</span>
          </button>
        )}
      </div>

      {/* Main Casting Call Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-8">
        {/* Title Header */}
        <div className="border-b border-slate-100 dark:border-slate-700 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              {call.productionType}
            </span>
            {/* Figure 24 Label #2: Posted Date */}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Posted: {call.postedDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {call.title}
          </h1>
        </div>

        {/* Figure 24 Label #3 & #4: Production Type & Special Details Grid */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Production Details & Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">Director</span>
              <span className="font-bold text-slate-900 dark:text-white">{call.directorName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">Producer</span>
              <span className="font-bold text-slate-900 dark:text-white">{call.producer || 'ECU School of Theatre & Dance'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">Shoot Day(s)</span>
              <span className="font-bold text-slate-900 dark:text-white">{call.shootDays}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">Rate of Pay</span>
              <span className="font-bold text-slate-900 dark:text-white">{call.rateOfPay}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">Location</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {call.location}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
              <span className="text-[11px] text-amber-800 dark:text-amber-400 uppercase font-semibold block mb-0.5">Audition Deadline</span>
              <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {call.deadline}
              </span>
            </div>
          </div>

          {call.specialSkills && call.specialSkills.length > 0 && (
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500">Special Requirements:</span>
              {call.specialSkills.map(skill => (
                <span key={skill} className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Storyline */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Storyline
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {call.storyline}
          </p>
        </div>

        {/* Figure 24 Label #5 & #6: Characters List & Apply Button */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Character Breakdown & Roles ({call.characters.length})
            </h2>
            <span className="text-xs text-slate-500">Select a character to apply</span>
          </div>

          <div className="space-y-4">
            {call.characters.map(char => {
              const hasApplied = appliedCharacterIds.includes(char.id);

              return (
                <div
                  key={char.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition hover:border-[var(--color-primary)]"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{char.name}</h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                        {char.roleType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {char.synopsis}
                    </p>

                    {/* Workflow Stages preview */}
                    <div className="pt-2 flex items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px]">Casting Stages:</span>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        {char.workflowStages.map((stg, i) => (
                          <span key={stg.id} className="flex items-center gap-1">
                            <span>{stg.stageName}</span>
                            {i < char.workflowStages.length - 1 && <span className="text-slate-400">→</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Figure 24 Label #6: Apply Button */}
                  <div className="self-end md:self-center flex-shrink-0">
                    {hasApplied ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedCharForApply(char)}
                        className="px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-semibold shadow-sm hover:scale-102 transition"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {selectedCharForApply && (
        <ApplyRoleModal
          isOpen={Boolean(selectedCharForApply)}
          onClose={() => setSelectedCharForApply(null)}
          castingCall={call}
          character={selectedCharForApply}
          onSuccess={() => {
            setSelectedCharForApply(null);
            setApplySuccessModal(true);
          }}
        />
      )}

      {/* Apply Success Modal */}
      {applySuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Audition Submitted!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your audition package was successfully submitted to the director. You can track progress in <strong>My Applications</strong>.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setApplySuccessModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Stay on Call
              </button>
              <button
                onClick={() => {
                  setApplySuccessModal(false);
                  navigateTo('my-applications');
                }}
                className="flex-1 py-2 rounded-xl btn-primary text-xs font-semibold"
              >
                View Applications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
