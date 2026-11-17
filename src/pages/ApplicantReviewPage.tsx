import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  User,
  CheckCircle2,
  Clock,
  Check,
  X,
  Play,
  Film,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const ApplicantReviewPage: React.FC<{ castingCallId: string }> = ({ castingCallId }) => {
  const { castingCalls, applications, updateApplicationDecision, navigateTo, users } = useApp();

  const call = castingCalls.find(c => c.id === castingCallId) || castingCalls[0];

  // Figure 28 Label #2: Character Dropdown
  const [selectedCharId, setSelectedCharId] = useState<string>(
    call.characters.length > 0 ? call.characters[0].id : 'all'
  );

  const selectedChar = call.characters.find(c => c.id === selectedCharId) || call.characters[0];

  // Figure 28 Label #3: Current stage in workflow
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const stages = selectedChar?.workflowStages || [
    { id: '1', stageName: 'Application', instructions: 'Initial review', order: 1 },
    { id: '2', stageName: 'Callback', instructions: 'Callback readings', order: 2 },
    { id: '3', stageName: 'Final Audition', instructions: 'Chemistry reads', order: 3 },
  ];

  const currentStageName = stages[currentStageIndex]?.stageName || 'Application';

  // Filter applicants for this casting call and character
  const charApplications = useMemo(() => {
    let list = applications.filter(a => a.casting_call_id === call.id);
    if (selectedCharId !== 'all') {
      list = list.filter(a => a.character_id === selectedCharId);
    }
    return list;
  }, [applications, call.id, selectedCharId]);

  // Local decision state
  const [decisions, setDecisions] = useState<Record<string, 'Advance' | 'Hold' | 'Offer Role' | 'Decline'>>({});
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleDecision = (appId: string, dec: 'Advance' | 'Hold' | 'Offer Role' | 'Decline') => {
    setDecisions(prev => ({ ...prev, [appId]: dec }));
  };

  // Figure 28 Label #6: Save Decisions Button
  const handleSaveDecisions = () => {
    Object.entries(decisions).forEach(([appId, decision]) => {
      updateApplicationDecision(appId, decision, currentStageName);
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  // Figure 28 Label #7: Finalize Stage Button
  const handleFinalizeStage = () => {
    handleSaveDecisions();
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  // Figure 28 Label #5: Return to Previous Stage Button
  const handleReturnToPreviousStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Figure 28 Label #1: Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('casting-call-detail', call.id)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[var(--color-primary)] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Casting Call</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2.5 py-1 rounded-full">
            Director Casting Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Applicant Review
          </h1>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
            Production: {call.title}
          </p>
        </div>

        {/* Controls: Character Dropdown & Workflow Stepper */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Figure 28 Label #2: Character Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Character:</label>
              <select
                value={selectedCharId}
                onChange={e => {
                  setSelectedCharId(e.target.value);
                  setCurrentStageIndex(0);
                }}
                className="text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
              >
                <option value="all">All Characters ({call.characters.length})</option>
                {call.characters.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name} ({ch.roleType})
                  </option>
                ))}
              </select>
            </div>

            {/* Figure 28 Label #3: Character Casting Workflow Stepper */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400 font-medium">Stage:</span>
              <div className="flex items-center gap-1.5">
                {stages.map((stg, i) => (
                  <button
                    key={stg.id}
                    onClick={() => setCurrentStageIndex(i)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition ${
                      currentStageIndex === i
                        ? 'btn-primary font-bold shadow-xs'
                        : i < currentStageIndex
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{stg.stageName}</span>
                    {i < currentStageIndex && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {stages[currentStageIndex]?.instructions && (
            <p className="text-xs text-slate-500 italic">
              Stage instructions: &quot;{stages[currentStageIndex].instructions}&quot;
            </p>
          )}
        </div>

        {savedBanner && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Decisions successfully saved to applicant records!</span>
          </div>
        )}

        {/* Figure 28 Label #4: Applicant List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider px-2">
            <span>Applicant ({charApplications.length})</span>
            <span>Audition Submission</span>
            <span>Director Decision</span>
          </div>

          {charApplications.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              {charApplications.map(app => {
                const currentDecision = decisions[app.id] || app.decision;
                const performerUser = users.find(u => u.id === app.performer_id);

                return (
                  <div
                    key={app.id}
                    className="p-4 sm:p-5 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Performer info & Profile link */}
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <img
                        src={app.performerHeadshot}
                        alt={app.performerName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {app.performerName}
                        </h4>
                        <p className="text-xs text-slate-500">For {app.characterName}</p>
                        <button
                          onClick={() => navigateTo('profile', app.performer_id)}
                          className="text-[11px] font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <span>View Performer Profile</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>

                    {/* Submission Details */}
                    <div className="flex-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <p className="line-clamp-2 italic">&quot;{app.auditionNotes || 'No cover note attached'}&quot;</p>
                      {app.auditionVideoUrl && (
                        <button
                          onClick={() => setPlayingVideo(app.auditionVideoUrl!)}
                          className="px-2.5 py-1 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold text-[11px] inline-flex items-center gap-1 hover:brightness-95"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Watch Audition Tape</span>
                        </button>
                      )}
                    </div>

                    {/* Decision Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end md:self-center flex-shrink-0">
                      {(['Advance', 'Hold', 'Offer Role', 'Decline'] as const).map(decOption => (
                        <button
                          key={decOption}
                          onClick={() => handleDecision(app.id, decOption)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                            currentDecision === decOption
                              ? decOption === 'Advance'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : decOption === 'Offer Role'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : decOption === 'Hold'
                                ? 'bg-amber-500 text-white border-amber-500'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {decOption}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                No applicants currently submitted for this character role.
              </p>
            </div>
          )}
        </div>

        {/* Action Controls: Label #5 Return, #6 Save, #7 Finalize Stage */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
          {/* Label #5: Return to Previous Stage Button */}
          <button
            onClick={handleReturnToPreviousStage}
            disabled={currentStageIndex === 0}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 disabled:opacity-40"
          >
            ← Return to Previous Stage
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Label #6: Save Decisions Button */}
            <button
              onClick={handleSaveDecisions}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Save Decisions
            </button>

            {/* Label #7: Finalize Stage Button */}
            <button
              onClick={handleFinalizeStage}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl btn-primary text-xs font-bold shadow-md"
            >
              Finalize Stage →
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-4 relative">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 z-10 text-white bg-black/60 p-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <video controls autoPlay className="w-full aspect-video rounded-xl">
              <source src={playingVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
};
