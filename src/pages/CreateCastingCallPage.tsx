import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CharacterRole, WorkflowStage } from '../types';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  FileCheck,
  Edit2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const CreateCastingCallPage: React.FC = () => {
  const { createCastingCall, navigateTo, currentUser } = useApp();

  // Wizard Step: 1 = Details, 2 = Characters, 3 = Review
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState('');

  // Step 1: Details
  const [title, setTitle] = useState('');
  const [productionType, setProductionType] = useState<'Play' | 'Musical' | 'Film' | 'Student Film' | 'Other'>('Play');
  const [producer, setProducer] = useState('ECU School of Theatre & Dance');
  const [writer, setWriter] = useState('');
  const [castingDirector, setCastingDirector] = useState(currentUser?.name || '');
  const [shootDays, setShootDays] = useState('');
  const [rateOfPay, setRateOfPay] = useState('Academic Credit / Portfolio');
  const [location, setLocation] = useState('Greenville/ECU');
  const [deadline, setDeadline] = useState('2026-12-15');
  const [specialSkills, setSpecialSkills] = useState('Acting, Voice');
  const [storyline, setStoryline] = useState('');

  // Step 2: Characters
  const [characters, setCharacters] = useState<CharacterRole[]>([
    {
      id: `char-1`,
      name: 'Lead Character',
      synopsis: 'Central character in the production.',
      roleType: 'Lead',
      workflowStages: [
        { id: 'stg-1', stageName: 'Application', instructions: 'Submit headshot and audition reel', order: 1 },
        { id: 'stg-2', stageName: 'Callback', instructions: 'Sides reading in Messick Theatre', order: 2 },
        { id: 'stg-3', stageName: 'Final Audition', instructions: 'Chemistry test and final director notes', order: 3 },
      ]
    }
  ]);

  const [expandedStageId, setExpandedStageId] = useState<string | null>('stg-1');

  // Character handlers
  const handleAddCharacter = () => {
    const newId = `char-${Date.now()}`;
    const newChar: CharacterRole = {
      id: newId,
      name: `Character #${characters.length + 1}`,
      synopsis: 'Role description and character arc...',
      roleType: 'Supporting Character',
      workflowStages: [
        { id: `stg-${Date.now()}-1`, stageName: 'Application', instructions: 'Submit headshot and resume', order: 1 },
        { id: `stg-${Date.now()}-2`, stageName: 'Callback', instructions: 'Callback audition reading', order: 2 },
      ]
    };
    setCharacters([...characters, newChar]);
  };

  const handleRemoveCharacter = (id: string) => {
    if (characters.length === 1) return;
    setCharacters(characters.filter(c => c.id !== id));
  };

  const handleCharacterChange = (id: string, field: 'name' | 'synopsis' | 'roleType', value: any) => {
    setCharacters(characters.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // Workflow stage handlers
  const handleAddStage = (charId: string) => {
    setCharacters(characters.map(c => {
      if (c.id === charId) {
        const nextOrder = c.workflowStages.length + 1;
        const newStage: WorkflowStage = {
          id: `stg-${Date.now()}`,
          stageName: 'Callback',
          instructions: 'Instructions for this stage...',
          order: nextOrder,
        };
        return { ...c, workflowStages: [...c.workflowStages, newStage] };
      }
      return c;
    }));
  };

  const handleRemoveStage = (charId: string, stageId: string) => {
    setCharacters(characters.map(c => {
      if (c.id === charId) {
        if (c.workflowStages.length <= 1) return c;
        return { ...c, workflowStages: c.workflowStages.filter(s => s.id !== stageId) };
      }
      return c;
    }));
  };

  const handleStageChange = (charId: string, stageId: string, field: 'stageName' | 'instructions', value: any) => {
    setCharacters(characters.map(c => {
      if (c.id === charId) {
        return {
          ...c,
          workflowStages: c.workflowStages.map(s => (s.id === stageId ? { ...s, [field]: value } : s))
        };
      }
      return c;
    }));
  };

  // Step 1 validation
  const handleNextFromDetails = () => {
    if (!title.trim()) {
      setError('Please enter a production title.');
      return;
    }
    if (!deadline) {
      setError('Please select an audition deadline.');
      return;
    }
    setError('');
    setStep(2);
  };

  // Step 2 validation
  const handleNextFromCharacters = () => {
    for (const c of characters) {
      if (!c.name.trim()) {
        setError('All characters must have a character name.');
        return;
      }
    }
    setError('');
    setStep(3);
  };

  // Step 3 submission
  const handlePublish = (status: 'Draft' | 'Open') => {
    const created = createCastingCall({
      title,
      productionType,
      producer,
      writer,
      castingDirector,
      shootDays,
      rateOfPay,
      location,
      deadline,
      specialSkills: specialSkills.split(',').map(s => s.trim()).filter(Boolean),
      storyline,
      status,
      characters,
    });

    navigateTo('casting-call-detail', created.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Figure 25 Label #1: Workflow Stepper Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Create Casting Call</h1>
        <div className="flex items-center justify-center gap-6 text-xs sm:text-sm font-semibold pt-2">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 ${step === 1 ? 'text-[var(--color-primary)] font-bold' : 'text-slate-400'}`}
          >
            <span>{step >= 1 ? '●' : '○'}</span>
            <span>Details</span>
          </button>
          <span className="text-slate-300">———</span>
          <button
            onClick={() => handleNextFromDetails()}
            className={`flex items-center gap-1.5 ${step === 2 ? 'text-[var(--color-primary)] font-bold' : 'text-slate-400'}`}
          >
            <span>{step >= 2 ? '●' : '○'}</span>
            <span>Characters</span>
          </button>
          <span className="text-slate-300">———</span>
          <button
            onClick={() => {
              handleNextFromDetails();
              handleNextFromCharacters();
            }}
            className={`flex items-center gap-1.5 ${step === 3 ? 'text-[var(--color-primary)] font-bold' : 'text-slate-400'}`}
          >
            <span>{step === 3 ? '●' : '○'}</span>
            <span>Review</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* --- STEP 1: DETAILS (Figure 25) --- */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
            Production Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Title: *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. The Crucible, The Winter Hearth"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary"
              />
            </div>

            {/* Production Type */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Production Type:
              </label>
              <select
                value={productionType}
                onChange={e => setProductionType(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Play">Play</option>
                <option value="Musical">Musical</option>
                <option value="Film">Film</option>
                <option value="Student Film">Student Film</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Shoot Days */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shoot Day(s) / Rehearsal Window:
              </label>
              <input
                type="text"
                value={shootDays}
                onChange={e => setShootDays(e.target.value)}
                placeholder="e.g. Dec 4-8, 2026 or Spring Semester"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Producer */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Producer:
              </label>
              <input
                type="text"
                value={producer}
                onChange={e => setProducer(e.target.value)}
                placeholder="e.g. ECU School of Theatre & Dance"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Rate of Pay */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rate of Pay:
              </label>
              <input
                type="text"
                value={rateOfPay}
                onChange={e => setRateOfPay(e.target.value)}
                placeholder="e.g. Academic Credit, Stipend, Meals & IMDb"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Writer */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Writer:
              </label>
              <input
                type="text"
                value={writer}
                onChange={e => setWriter(e.target.value)}
                placeholder="Playwright or screenwriter"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location:
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Greenville/ECU">Greenville/ECU</option>
                <option value="Other NC">Other NC</option>
                <option value="Remote/Online">Remote/Online</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Casting Director */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Casting Director:
              </label>
              <input
                type="text"
                value={castingDirector}
                onChange={e => setCastingDirector(e.target.value)}
                placeholder="Casting Director name"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Audition Deadline: *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Special Skills */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Special Skills (comma separated):
              </label>
              <input
                type="text"
                value={specialSkills}
                onChange={e => setSpecialSkills(e.target.value)}
                placeholder="e.g. Singing, Dance, Stage Combat, Accents/Dialects"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Label #3: Storyline */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Storyline / Synopsis:
              </label>
              <textarea
                rows={4}
                value={storyline}
                onChange={e => setStoryline(e.target.value)}
                placeholder="Provide a compelling synopsis of the project and themes..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Label #4 & #5: Cancel and Next Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigateTo('casting-calls')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNextFromDetails}
              className="px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-semibold shadow-md"
            >
              Next: Characters →
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 2: CHARACTERS (Figure 26) --- */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Characters & Casting Workflows</h2>
              <p className="text-xs text-slate-500">Configure role descriptions and custom multi-stage audition pipelines.</p>
            </div>

            {/* Label #10: Add Character Button */}
            <button
              onClick={handleAddCharacter}
              className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Character</span>
            </button>
          </div>

          <div className="space-y-6">
            {characters.map((char, charIdx) => (
              /* Label #1: Character Card */
              <div
                key={char.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="font-bold text-sm text-[var(--color-primary)]">Character #{charIdx + 1}</span>
                  {characters.length > 1 && (
                    /* Label #3: Remove Character Button */
                    <button
                      onClick={() => handleRemoveCharacter(char.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>- Remove</span>
                    </button>
                  )}
                </div>

                {/* Label #2: Character Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Character Name:</label>
                    <input
                      type="text"
                      value={char.name}
                      onChange={e => handleCharacterChange(char.id, 'name', e.target.value)}
                      placeholder="e.g. Mabel Stanley"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Role Position:</label>
                    <select
                      value={char.roleType}
                      onChange={e => handleCharacterChange(char.id, 'roleType', e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Supporting Character">Supporting Character</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Character Synopsis:</label>
                    <textarea
                      rows={2}
                      value={char.synopsis}
                      onChange={e => handleCharacterChange(char.id, 'synopsis', e.target.value)}
                      placeholder="Character vocal type, personality, motivations..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Label #4: Casting Workflow */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Casting Workflow Stages
                    </span>
                    {/* Label #8: Add Workflow Stage Button */}
                    <button
                      onClick={() => handleAddStage(char.id)}
                      className="text-xs text-[var(--color-primary)] font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Stage</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {char.workflowStages.map((stg, stgIdx) => (
                      <div
                        key={stg.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="font-bold text-slate-400">{stgIdx + 1}.</span>
                            {/* Label #5: Casting Category Dropdown */}
                            <select
                              value={stg.stageName}
                              onChange={e => handleStageChange(char.id, stg.id, 'stageName', e.target.value)}
                              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 text-xs"
                            >
                              <option value="Application">Application</option>
                              <option value="Callback">Callback</option>
                              <option value="Final Audition">Final Audition</option>
                            </select>

                            {/* Label #7: Expand Workflow Step Arrow */}
                            <button
                              type="button"
                              onClick={() => setExpandedStageId(expandedStageId === stg.id ? null : stg.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              title="Expand for details"
                            >
                              {expandedStageId === stg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Label #6: Remove Workflow Step Button */}
                          {char.workflowStages.length > 1 && (
                            <button
                              onClick={() => handleRemoveStage(char.id, stg.id)}
                              className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                            >
                              - Remove
                            </button>
                          )}
                        </div>

                        {expandedStageId === stg.id && (
                          <div className="pt-2 animate-in fade-in">
                            <label className="block text-[11px] text-slate-500 font-medium mb-1">
                              Stage Instructions / Submission Requirements for Performers:
                            </label>
                            <input
                              type="text"
                              value={stg.instructions}
                              onChange={e => handleStageChange(char.id, stg.id, 'instructions', e.target.value)}
                              placeholder="e.g. Prepare 32-bar legit golden age cut or scene sides"
                              className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Label #9: Back Button and Next */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300"
            >
              ← Back to Details
            </button>
            <button
              type="button"
              onClick={handleNextFromCharacters}
              className="px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-semibold shadow-md"
            >
              Next: Review & Publish →
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: REVIEW (Figure 27) --- */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
            Review Casting Call
          </h2>

          {/* Label #1: Details entered in Details page */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">Production Details</h3>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <p><strong>Title:</strong> {title}</p>
              <p><strong>Production Type:</strong> {productionType}</p>
              <p><strong>Producer:</strong> {producer}</p>
              <p><strong>Casting Director:</strong> {castingDirector}</p>
              <p><strong>Shoot Days:</strong> {shootDays || 'TBA'}</p>
              <p><strong>Rate of Pay:</strong> {rateOfPay}</p>
              <p><strong>Location:</strong> {location}</p>
              <p><strong>Audition Deadline:</strong> {deadline}</p>
              <p className="sm:col-span-2"><strong>Special Skills:</strong> {specialSkills}</p>
              <p className="sm:col-span-2"><strong>Storyline:</strong> {storyline || 'No storyline specified'}</p>
            </div>
          </div>

          {/* Label #2 & #3: Characters List and Character Edit Button */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Characters ({characters.length})
              </h3>
              <button
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Characters</span>
              </button>
            </div>

            <div className="space-y-3">
              {characters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {idx + 1}. {ch.name} ({ch.roleType})
                    </span>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-[var(--color-primary)] font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs">{ch.synopsis}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Workflow: {ch.workflowStages.map(s => s.stageName).join(' → ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Label #4 & #5: Save Draft Button and Publish Button */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300"
            >
              ← Back
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handlePublish('Draft')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handlePublish('Open')}
                className="px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-bold shadow-md"
              >
                Publish Casting Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
