import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Characteristics, LanguageProficiency, LanguageSkill, User } from '../types';
import {
  GENDER_OPTIONS,
  ETHNICITY_OPTIONS,
  HAIR_COLOR_OPTIONS,
  EYE_COLOR_OPTIONS,
  LANGUAGE_OPTIONS,
  LANGUAGE_PROFICIENCY_OPTIONS,
  parseHeightParts,
  formatHeightMask,
  normalizeCharacteristics,
} from '../data/characteristicsOptions';
import { X, Sparkles, Check, Plus, Trash2, Languages, ShieldCheck } from 'lucide-react';

interface EditCharacteristicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const DEFAULT_CHARACTERISTICS = (userId: string): Characteristics => ({
  id: `char-${userId}`,
  performer_id: userId,
  height: `5' 6"`,
  gender: 'Prefer not to say',
  ethnicity: 'Prefer not to say',
  hair_color: 'Prefer not to say',
  eye_color: 'Prefer not to say',
  has_piercings: 'No',
  has_tattoos: 'No',
  partial_nudity: 'No',
  full_nudity: 'No',
  languages: [],
});

export const EditCharacteristicsModal: React.FC<EditCharacteristicsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { updateUserProfile } = useApp();

  const [formData, setFormData] = useState<Characteristics>(() => {
    return normalizeCharacteristics(user.characteristics, user.id) || DEFAULT_CHARACTERISTICS(user.id);
  });

  const [heightFeet, setHeightFeet] = useState<string>(() => parseHeightParts(formData.height).feet);
  const [heightInches, setHeightInches] = useState<string>(() => parseHeightParts(formData.height).inches);
  const inchesInputRef = useRef<HTMLInputElement>(null);
  const feetInputRef = useRef<HTMLInputElement>(null);

  // Language builder state
  const [newCustomLang, setNewCustomLang] = useState<string>('');
  const [newLangProficiency, setNewLangProficiency] = useState<LanguageProficiency>('Conversational');
  const presetLanguages = useMemo(() => LANGUAGE_OPTIONS.filter(l => l !== 'Other'), []);

  useEffect(() => {
    if (isOpen) {
      const normalized =
        normalizeCharacteristics(user.characteristics, user.id) || DEFAULT_CHARACTERISTICS(user.id);
      setFormData(normalized);
      const parsed = parseHeightParts(normalized.height);
      setHeightFeet(parsed.feet);
      setHeightInches(parsed.inches);
      setNewCustomLang('');
    }
  }, [isOpen, user]);

  // Keep formData.height synced with masked feet & inches
  const updateHeight = (feet: string, inches: string) => {
    setHeightFeet(feet);
    setHeightInches(inches);
    setFormData(prev => ({
      ...prev,
      height: formatHeightMask(feet, inches),
    }));
  };

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 1);
    updateHeight(digits, heightInches);
    if (digits.length === 1) {
      inchesInputRef.current?.focus();
    }
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
    if (digits === '') {
      updateHeight(heightFeet, '');
      return;
    }
    const num = parseInt(digits, 10);
    if (num > 11) {
      // Clamp to 11 inches max
      updateHeight(heightFeet, '11');
    } else {
      updateHeight(heightFeet, digits);
    }
  };

  const handleInchesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && heightInches === '') {
      feetInputRef.current?.focus();
    }
  };

  const handleFieldChange = <K extends keyof Characteristics>(field: K, val: Characteristics[K]) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  // Languages management
  const handleTogglePresetLanguage = (langName: string) => {
    const existing = formData.languages.find(
      l => l.language.toLowerCase() === langName.toLowerCase()
    );
    if (existing) {
      setFormData(prev => ({
        ...prev,
        languages: prev.languages.filter(l => l.id !== existing.id),
      }));
    } else {
      const nextLang: LanguageSkill = {
        id: `lang-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        language: langName,
        proficiency: newLangProficiency,
      };
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, nextLang],
      }));
    }
  };

  const handleAddCustomLanguage = () => {
    const langName = newCustomLang.trim();
    if (!langName) return;

    const alreadyExists = formData.languages.some(
      l => l.language.toLowerCase() === langName.toLowerCase()
    );
    if (alreadyExists) {
      setFormData(prev => ({
        ...prev,
        languages: prev.languages.map(l =>
          l.language.toLowerCase() === langName.toLowerCase()
            ? { ...l, proficiency: newLangProficiency }
            : l
        ),
      }));
    } else {
      const nextLang: LanguageSkill = {
        id: `lang-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        language: langName,
        proficiency: newLangProficiency,
      };
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, nextLang],
      }));
    }
    setNewCustomLang('');
  };

  const handleUpdateLanguageProficiency = (id: string, proficiency: LanguageProficiency) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map(l => (l.id === id ? { ...l, proficiency } : l)),
    }));
  };

  const handleRemoveLanguage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalHeight =
      heightFeet || heightInches ? formatHeightMask(heightFeet, heightInches) : '';

    updateUserProfile(user.id, {
      characteristics: {
        ...formData,
        height: finalHeight,
      },
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
              Edit Performer Characteristics
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Physical attributes, languages, body modifications, and nudity comfort
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-7">
          {/* SECTION 1: Physical & Identity Attributes */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3 pb-1.5 border-b border-[#E5E5E0] dark:border-stone-700">
              Physical &amp; Identity Attributes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              {/* Masked Height Field (Feet & Inches) */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Height (Feet &amp; Inches)
                </label>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
                  <input
                    ref={feetInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={heightFeet}
                    onChange={handleFeetChange}
                    placeholder="5"
                    aria-label="Height in feet"
                    className="w-7 text-center font-bold text-sm text-stone-900 dark:text-white bg-stone-50 dark:bg-stone-700/70 rounded-md py-0.5 focus:outline-none"
                  />
                  <span className="text-stone-500 dark:text-stone-400 font-bold select-none">ft (&apos;)</span>
                  <input
                    ref={inchesInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={heightInches}
                    onChange={handleInchesChange}
                    onKeyDown={handleInchesKeyDown}
                    placeholder="6"
                    aria-label="Height in inches"
                    className="w-9 text-center font-bold text-sm text-stone-900 dark:text-white bg-stone-50 dark:bg-stone-700/70 rounded-md py-0.5 focus:outline-none"
                  />
                  <span className="text-stone-500 dark:text-stone-400 font-bold select-none">in (&quot;)</span>
                  <span className="ml-auto text-[11px] font-mono text-stone-400">
                    {heightFeet || heightInches ? formatHeightMask(heightFeet, heightInches) : '--'}
                  </span>
                </div>
              </div>

              {/* Gender Dropdown */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={e => handleFieldChange('gender', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white ring-theme-primary"
                >
                  {GENDER_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Race / Ethnicity Dropdown */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Race / Ethnicity
                </label>
                <select
                  value={formData.ethnicity}
                  onChange={e => handleFieldChange('ethnicity', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white ring-theme-primary"
                >
                  {ETHNICITY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Hair Color Dropdown */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Hair Color
                </label>
                <select
                  value={formData.hair_color}
                  onChange={e => handleFieldChange('hair_color', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white ring-theme-primary"
                >
                  {HAIR_COLOR_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Eye Color Dropdown */}
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Eye Color
                </label>
                <select
                  value={formData.eye_color}
                  onChange={e => handleFieldChange('eye_color', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white ring-theme-primary"
                >
                  {EYE_COLOR_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 2: Body Modifications & Nudity */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Body Modifications */}
            <div className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-stone-800/70 border border-[#E5E5E0] dark:border-stone-700 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Body Modifications
              </h3>

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  Do you have piercings?
                </span>
                <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 p-0.5">
                  {(['Yes', 'No'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleFieldChange('has_piercings', opt)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        formData.has_piercings === opt
                          ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  Do you have tattoos?
                </span>
                <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 p-0.5">
                  {(['Yes', 'No'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleFieldChange('has_tattoos', opt)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        formData.has_tattoos === opt
                          ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nudity */}
            <div className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-stone-800/70 border border-[#E5E5E0] dark:border-stone-700 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Nudity Comfort</span>
              </h3>

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  Will you do partial nudity?
                </span>
                <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 p-0.5">
                  {(['Yes', 'No'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleFieldChange('partial_nudity', opt)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        formData.partial_nudity === opt
                          ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  Will you do full nudity?
                </span>
                <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 p-0.5">
                  {(['Yes', 'No'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleFieldChange('full_nudity', opt)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        formData.full_nudity === opt
                          ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Languages & Fluency */}
          <section className="space-y-3">
            <div className="border-b border-[#E5E5E0] dark:border-stone-700 pb-1.5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" />
                <span>Languages &amp; Fluency ({formData.languages.length} selected)</span>
              </h3>
            </div>

            {/* Select from Languages List */}
            <div className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-stone-800/60 border border-[#E5E5E0] dark:border-stone-700 space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Select Languages
              </p>
              <div className="flex flex-wrap gap-1.5">
                {presetLanguages.map(langName => {
                  const isSelected = formData.languages.some(
                    l => l.language.toLowerCase() === langName.toLowerCase()
                  );
                  return (
                    <button
                      type="button"
                      key={langName}
                      onClick={() => handleTogglePresetLanguage(langName)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition flex items-center gap-1 ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-semibold shadow-2xs'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{langName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Another / Custom Language */}
            <div className="flex flex-col sm:flex-row gap-2 text-xs">
              <input
                type="text"
                value={newCustomLang}
                onChange={e => setNewCustomLang(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomLanguage();
                  }
                }}
                placeholder="Add another language..."
                className="flex-1 p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />

              <select
                value={newLangProficiency}
                onChange={e => setNewLangProficiency(e.target.value as LanguageProficiency)}
                aria-label="Language fluency level"
                className="sm:w-56 p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
              >
                {LANGUAGE_PROFICIENCY_OPTIONS.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddCustomLanguage}
                className="px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Language</span>
              </button>
            </div>

            {/* Added Languages & Fluency Levels */}
            {formData.languages.length > 0 ? (
              <div className="space-y-2">
                {formData.languages.map(lang => (
                  <div
                    key={lang.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#F8F7F4] dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 text-xs"
                  >
                    <span className="font-bold text-stone-900 dark:text-white">{lang.language}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={lang.proficiency}
                        onChange={e =>
                          handleUpdateLanguageProficiency(
                            lang.id,
                            e.target.value as LanguageProficiency
                          )
                        }
                        aria-label={`${lang.language} fluency`}
                        className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-xs font-medium"
                      >
                        {LANGUAGE_PROFICIENCY_OPTIONS.map(p => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Remove language"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">
                No languages added yet. Select languages above or add another language.
              </p>
            )}
          </section>

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
              Save Characteristics
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
