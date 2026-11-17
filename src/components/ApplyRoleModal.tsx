import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CharacterRole, CastingCall } from '../types';
import { X, CheckCircle2, Film, Video, AlertCircle } from 'lucide-react';

interface ApplyRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  castingCall: CastingCall;
  character: CharacterRole;
  onSuccess: () => void;
}

export const ApplyRoleModal: React.FC<ApplyRoleModalProps> = ({
  isOpen,
  onClose,
  castingCall,
  character,
  onSuccess,
}) => {
  const { currentUser, applyForRole, media } = useApp();
  const [notes, setNotes] = useState('');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const userVideos = currentUser ? (media[currentUser.id] || []).filter(m => m.type === 'video') : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please log in before applying.');
      return;
    }

    setSubmitting(true);
    setError('');

    const finalVideoUrl = customVideoUrl.trim() || selectedVideoUrl;
    const res = applyForRole(castingCall.id, character.id, notes, finalVideoUrl);
    setSubmitting(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Failed to submit application.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2.5 py-1 rounded-full">
            Role Audition Application
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
            Apply for {character.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Production: <strong>{castingCall.title}</strong> ({castingCall.productionType})
          </p>
        </div>

        {/* Character Brief */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-5 text-sm">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">Character Description:</p>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{character.synopsis}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">Casting Workflow:</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
              {character.workflowStages.map((s, idx) => (
                <span key={s.id} className="flex items-center gap-1">
                  <span>{s.stageName}</span>
                  {idx < character.workflowStages.length - 1 && <span className="text-slate-400">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Performer Cover Note / Slate Details
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Introduce yourself, highlight relevant training at ECU School of Theatre & Dance, and state your availability for rehearsals..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Audition Reel / Self-Tape Video
            </label>
            {userVideos.length > 0 && (
              <div className="mb-2 space-y-1.5">
                <span className="text-[11px] text-slate-500">Select from your uploaded profile reels:</span>
                {userVideos.map(v => (
                  <label
                    key={v.id}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                      selectedVideoUrl === v.file_path
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="radio"
                        name="videoPick"
                        checked={selectedVideoUrl === v.file_path}
                        onChange={() => {
                          setSelectedVideoUrl(v.file_path);
                          setCustomVideoUrl('');
                        }}
                        className="text-[var(--color-primary)]"
                      />
                      <span className="truncate">{v.title}</span>
                    </div>
                    {v.durationSeconds && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {Math.floor(v.durationSeconds / 60)}:{(v.durationSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}

            <div className="mt-1">
              <span className="text-[11px] text-slate-500">Or provide link to self-tape / unlisted video (Vimeo / YouTube):</span>
              <input
                type="url"
                value={customVideoUrl}
                onChange={e => {
                  setCustomVideoUrl(e.target.value);
                  setSelectedVideoUrl('');
                }}
                placeholder="https://vimeo.com/... or https://youtu.be/..."
                className="w-full mt-1 text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Your verified ECU performer resume and physical characteristics will be automatically attached!</span>
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
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl btn-primary text-sm font-semibold shadow-md disabled:opacity-50 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
