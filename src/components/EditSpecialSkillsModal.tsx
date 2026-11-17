import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import {
  SPECIAL_SKILLS_CATEGORIES,
  VOCAL_RANGE_PRESETS,
  getAllCategorySkills,
} from '../data/characteristicsOptions';
import { X, Sparkles, Check, Search } from 'lucide-react';

interface EditSpecialSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const EditSpecialSkillsModal: React.FC<EditSpecialSkillsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { updateUserProfile } = useApp();

  const [specialSkillsInput, setSpecialSkillsInput] = useState<string[]>(user.specialSkills || []);
  const [activeSkillCatId, setActiveSkillCatId] = useState<string>(SPECIAL_SKILLS_CATEGORIES[0].id);
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [customSkillText, setCustomSkillText] = useState<string>('');

  // Inline specification helper (vocal range / accent region / firearms training)
  const [specPrompt, setSpecPrompt] = useState<{
    baseSkill: string;
    label: string;
    placeholder: string;
    presets?: string[];
  } | null>(null);
  const [specValue, setSpecValue] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSpecialSkillsInput(user.specialSkills || []);
      setSkillSearch('');
      setCustomSkillText('');
      setSpecPrompt(null);
      setSpecValue('');
    }
  }, [isOpen, user]);

  const isSkillOrVariantSelected = (refSkill: string): string | undefined => {
    const exact = specialSkillsInput.find(s => s.toLowerCase() === refSkill.toLowerCase());
    if (exact) return exact;
    const base = refSkill.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
    if (refSkill.includes('(identify') || refSkill.includes('(specify')) {
      return specialSkillsInput.find(s => s.toLowerCase().startsWith(base + ' ('));
    }
    return undefined;
  };

  const handleSkillToggle = (refSkill: string) => {
    const existing = isSkillOrVariantSelected(refSkill);
    if (existing) {
      setSpecialSkillsInput(prev => prev.filter(s => s !== existing));
      if (specPrompt && existing.toLowerCase().startsWith(specPrompt.baseSkill.toLowerCase())) {
        setSpecPrompt(null);
      }
      return;
    }

    if (refSkill === 'Singing (identify vocal range)') {
      setSpecPrompt({
        baseSkill: 'Singing',
        label: 'Identify your vocal range',
        placeholder: 'e.g. Soprano, Tenor, Baritone...',
        presets: VOCAL_RANGE_PRESETS,
      });
      setSpecValue('');
      return;
    }
    if (refSkill === 'African Accents (specify region)') {
      setSpecPrompt({
        baseSkill: 'African Accents',
        label: 'Specify African accent region',
        placeholder: 'e.g. West African, Nigerian, South African...',
      });
      setSpecValue('');
      return;
    }
    if (refSkill === 'Firearms Training (specify legitimate training)') {
      setSpecPrompt({
        baseSkill: 'Firearms Training',
        label: 'Specify legitimate firearms training / certification',
        placeholder: 'e.g. SAFD Theatrical Firearms Safety, Military...',
      });
      setSpecValue('');
      return;
    }

    setSpecialSkillsInput(prev => [...prev, refSkill]);
  };

  const handleConfirmSpecSkill = () => {
    if (!specPrompt) return;
    const detail = specValue.trim();
    const formatted = detail ? `${specPrompt.baseSkill} (${detail})` : specPrompt.baseSkill;
    if (!specialSkillsInput.includes(formatted)) {
      setSpecialSkillsInput(prev => [...prev, formatted]);
    }
    setSpecPrompt(null);
    setSpecValue('');
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillText.trim();
    if (!trimmed) return;
    if (!specialSkillsInput.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSpecialSkillsInput(prev => [...prev, trimmed]);
    }
    setCustomSkillText('');
  };

  const activeCategory = useMemo(
    () => SPECIAL_SKILLS_CATEGORIES.find(c => c.id === activeSkillCatId) || SPECIAL_SKILLS_CATEGORIES[0],
    [activeSkillCatId]
  );

  const searchResults = useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    if (!q) return null;
    const matches: { categoryTitle: string; skills: string[] }[] = [];
    for (const cat of SPECIAL_SKILLS_CATEGORIES) {
      const catMatches = getAllCategorySkills(cat).filter(s => s.toLowerCase().includes(q));
      if (catMatches.length > 0) {
        matches.push({ categoryTitle: `${cat.number}. ${cat.title}`, skills: catMatches });
      }
    }
    return matches;
  }, [skillSearch]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(user.id, {
      specialSkills: specialSkillsInput,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-[#E5E5E0] dark:border-stone-700 relative max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">
              Edit Special Skills
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Select performance disciplines from the Actor Resume Reference List or add custom skills
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="border-b border-[#E5E5E0] dark:border-stone-700 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
              Special Skills &amp; Performance Disciplines ({specialSkillsInput.length} selected)
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={skillSearch}
                onChange={e => setSkillSearch(e.target.value)}
                placeholder="Search reference list..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category Browser OR Search Results */}
          {searchResults ? (
            <div className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-stone-800/60 border border-[#E5E5E0] dark:border-stone-700 max-h-72 overflow-y-auto space-y-4">
              {searchResults.length > 0 ? (
                searchResults.map(group => (
                  <div key={group.categoryTitle} className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      {group.categoryTitle}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map(s => {
                        const selectedMatch = isSkillOrVariantSelected(s);
                        return (
                          <button
                            type="button"
                            key={s}
                            onClick={() => handleSkillToggle(s)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition flex items-center gap-1 ${
                              selectedMatch
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-semibold'
                                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                            }`}
                          >
                            {selectedMatch && <Check className="w-3 h-3" />}
                            <span>{selectedMatch || s}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 text-center py-4">
                  No matching skills in the reference list. You can add it below as a custom skill.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* 8 Category Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {SPECIAL_SKILLS_CATEGORIES.map(cat => {
                  const countInCat = getAllCategorySkills(cat).filter(s =>
                    Boolean(isSkillOrVariantSelected(s))
                  ).length;
                  const isActive = cat.id === activeCategory.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setActiveSkillCatId(cat.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1.5 ${
                        isActive
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-2xs'
                          : 'border-[#E5E5E0] dark:border-stone-700 bg-[#F8F7F4] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                      }`}
                    >
                      <span>
                        {cat.number}. {cat.title.split('&')[0].trim()}
                      </span>
                      {countInCat > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                          }`}
                        >
                          {countInCat}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Category Skills Grid */}
              <div className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-stone-800/60 border border-[#E5E5E0] dark:border-stone-700 max-h-64 overflow-y-auto space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  {activeCategory.number}. {activeCategory.title}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {activeCategory.skills.map(s => {
                    const selectedMatch = isSkillOrVariantSelected(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => handleSkillToggle(s)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition flex items-center gap-1 ${
                          selectedMatch
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-semibold shadow-2xs'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {selectedMatch && <Check className="w-3 h-3" />}
                        <span>{selectedMatch || s}</span>
                      </button>
                    );
                  })}
                </div>

                {activeCategory.subgroups?.map(sg => (
                  <div key={sg.label} className="pt-2 border-t border-stone-200/80 dark:border-stone-700 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      {sg.label}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sg.skills.map(s => {
                        const selectedMatch = isSkillOrVariantSelected(s);
                        return (
                          <button
                            type="button"
                            key={s}
                            onClick={() => handleSkillToggle(s)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition flex items-center gap-1 ${
                              selectedMatch
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-semibold shadow-2xs'
                                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                            }`}
                          >
                            {selectedMatch && <Check className="w-3 h-3" />}
                            <span>{selectedMatch || s}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inline detail prompt for skills requiring vocal range / accent region / training */}
          {specPrompt && (
            <div className="p-3.5 rounded-2xl bg-[var(--color-primary-subtle)] border border-[var(--color-primary-border)] space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-primary)]">
                  {specPrompt.label}
                </span>
                <button
                  type="button"
                  onClick={() => setSpecPrompt(null)}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
              </div>

              {specPrompt.presets && (
                <div className="flex flex-wrap gap-1.5">
                  {specPrompt.presets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSpecValue(preset)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                        specValue === preset
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={specValue}
                  onChange={e => setSpecValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmSpecSkill();
                    }
                  }}
                  placeholder={specPrompt.placeholder}
                  className="flex-1 text-xs p-2 rounded-lg border border-stone-300 bg-white text-stone-900"
                />
                <button
                  type="button"
                  onClick={handleConfirmSpecSkill}
                  className="px-4 py-2 rounded-lg btn-primary text-xs font-semibold"
                >
                  Add Skill
                </button>
              </div>
            </div>
          )}

          {/* Add Additional Custom Skill */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customSkillText}
              onChange={e => setCustomSkillText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomSkill();
                }
              }}
              placeholder="Add another specific skill or certification..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              + Add Custom
            </button>
          </div>

          {/* Currently Selected Skills Summary */}
          {specialSkillsInput.length > 0 && (
            <div className="p-3 rounded-xl bg-white dark:bg-stone-800/50 border border-[#E5E5E0] dark:border-stone-700">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                Selected Skills ({specialSkillsInput.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {specialSkillsInput.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--color-primary-subtle)] text-[var(--color-primary)] border border-[var(--color-primary-border)]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSpecialSkillsInput(prev => prev.filter(s => s !== skill))
                      }
                      className="hover:text-rose-600 ml-0.5"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Save / Cancel */}
          <div className="pt-4 border-t border-[#E5E5E0] dark:border-stone-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl btn-primary text-xs sm:text-sm font-semibold shadow-sm"
            >
              Save Special Skills
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
