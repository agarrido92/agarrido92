import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EditCharacteristicsModal } from '../components/EditCharacteristicsModal';
import { EditSpecialSkillsModal } from '../components/EditSpecialSkillsModal';
import { AddToFavoriteModal } from '../components/AddToFavoriteModal';
import {
  Heart,
  Edit3,
  MapPin,
  Globe,
  Plus,
  Play,
  Film,
  Music,
  Image as ImageIcon,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Mail,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Trash2,
  X,
  Languages,
  ShieldCheck
} from 'lucide-react';
import { RoleType } from '../types';
import {
  normalizeCharacteristics,
  SPECIAL_SKILLS_CATEGORIES,
  findCategoryForSkill,
} from '../data/characteristicsOptions';

export const ProfilePage: React.FC<{ userId?: string }> = ({ userId }) => {
  const {
    currentUser,
    users,
    castingCalls,
    resumes,
    media,
    navigateTo,
    isUserInFavorites,
    updateUserProfile,
    addMediaItem,
    saveResume
  } = useApp();

  // Find profile user (fallback to currentUser or first user)
  const profileUser = users.find(u => u.id === (userId || currentUser?.id)) || users[1];
  const isOwnProfile = currentUser?.id === profileUser.id;
  const isFavorited = isUserInFavorites(profileUser.id);

  // Active Profile Navigation Tab (Figure 19 Label #5: Overview, Resume, Media, Casting Calls)
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'media' | 'casting-calls'>('overview');

  // Resume Sub-Tab (Figure 20: Performer vs Director Resume)
  const [resumeRoleTab, setResumeRoleTab] = useState<RoleType>('Performer');

  // Modals state
  const [isEditCharacteristicsOpen, setIsEditCharacteristicsOpen] = useState(false);
  const [isEditSpecialSkillsOpen, setIsEditSpecialSkillsOpen] = useState(false);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [isEditAboutModalOpen, setIsEditAboutModalOpen] = useState(false);
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState(false);
  const [isResumeTemplateModalOpen, setIsResumeTemplateModalOpen] = useState(false);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  // Profile data
  const userResumes = resumes[profileUser.id] || [];
  const currentResume = userResumes.find(r => r.roleType === resumeRoleTab) || userResumes[0];
  const userMedia = media[profileUser.id] || [];
  const videos = userMedia.filter(m => m.type === 'video');
  const photos = userMedia.filter(m => m.type === 'photo');
  const audios = userMedia.filter(m => m.type === 'audio');

  const directorCalls = castingCalls.filter(c => c.director_id === profileUser.id);

  // Quick edit profile form state
  const [editAboutText, setEditAboutText] = useState(profileUser.about);
  const [editLocation, setEditLocation] = useState(profileUser.location);
  const [editSites, setEditSites] = useState(profileUser.sites.join(', '));
  const [editAvailability, setEditAvailability] = useState(profileUser.availability);

  // Media upload state
  const [uploadType, setUploadType] = useState<'video' | 'audio' | 'photo'>('video');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadDurationSecs, setUploadDurationSecs] = useState('90');
  const [uploadError, setUploadError] = useState('');

  // Handle media submission
  const handleMediaUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    const secs = parseInt(uploadDurationSecs, 10);
    if (uploadType === 'video' && secs > 180) {
      setUploadError('FR-003: Video upload duration cannot exceed 3 minutes (180 seconds).');
      return;
    }

    const res = addMediaItem(profileUser.id, {
      user_id: profileUser.id,
      type: uploadType,
      title: uploadTitle.trim() || 'Uploaded Media',
      file_path: uploadUrl.trim() || (uploadType === 'video'
        ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        : uploadType === 'audio'
        ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'),
      thumbnail_path: uploadType === 'video' ? 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80' : undefined,
      durationSeconds: uploadType === 'video' ? secs : undefined,
    });

    if (res.success) {
      setIsUploadMediaModalOpen(false);
      setUploadTitle('');
      setUploadUrl('');
    } else {
      setUploadError(res.error || 'Failed to upload media.');
    }
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileUser.id, {
      about: editAboutText,
      location: editLocation,
      sites: editSites.split(',').map(s => s.trim()).filter(Boolean),
      availability: editAvailability,
    });
    setIsEditAboutModalOpen(false);
  };

  const handleToggleAvailability = () => {
    if (!isOwnProfile) return;
    const nextStatus = profileUser.availability === 'Available' ? 'Busy with another project' : 'Available';
    updateUserProfile(profileUser.id, { availability: nextStatus });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Figure 19: Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Label #1: Headshot Photo */}
            <div className="relative flex-shrink-0">
              <img
                src={profileUser.headshot}
                alt={profileUser.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-[var(--color-accent)] shadow-md"
              />
              {/* AF-003: Availability status badge */}
              <button
                onClick={handleToggleAvailability}
                disabled={!isOwnProfile}
                title={isOwnProfile ? 'Click to toggle availability' : profileUser.availability}
                className={`absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md border-2 border-white dark:border-slate-800 flex items-center gap-1.5 transition ${
                  profileUser.availability === 'Available'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'
                } ${isOwnProfile ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>{profileUser.availability}</span>
              </button>
            </div>

            {/* Label #2: User Name and Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {profileUser.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {profileUser.classification}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Roles:</span>
                {profileUser.roles.map(r => (
                  <span
                    key={r}
                    className="px-2 py-0.5 rounded-md font-bold bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  >
                    {r}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileUser.location}</span>
                </span>
                {profileUser.sites && profileUser.sites.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    {profileUser.sites.map((site, i) => (
                      <a
                        key={i}
                        href={site.startsWith('http') ? site : `https://${site}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>{site.replace(/^https?:\/\//, '').split('/')[0]}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Label #4: Favorite Button or Edit Button */}
          <div className="flex items-center gap-2 self-start md:self-center">
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditAboutModalOpen(true)}
                className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavoriteModalOpen(true)}
                  className={`p-2.5 rounded-xl border transition shadow-xs flex items-center gap-1.5 text-xs font-semibold ${
                    isFavorited
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  title="Save to Favorites"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFavorited ? 'Saved in Favorites' : 'Favorite'}</span>
                </button>

                <button
                  onClick={() => navigateTo('messages', profileUser.id)}
                  className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Direct Message</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Label #3: User About Me */}
        <div className="pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            About Me
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {profileUser.about || 'No personal bio added yet.'}
          </p>
        </div>
      </div>

      {/* Label #5: Profile Navigation (Overview, Resume, Media, Casting Calls) */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-2 sm:px-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`py-3 px-2 sm:px-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'resume'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          Resume
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`py-3 px-2 sm:px-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'media'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>Media</span>
          {userMedia.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {userMedia.length}
            </span>
          )}
        </button>

        {/* Casting Calls tab: only appears if the profile has the Director role (Figure 19 Label #5 Annotation) */}
        {profileUser.roles.includes('Director') && (
          <button
            onClick={() => setActiveTab('casting-calls')}
            className={`py-3 px-2 sm:px-4 text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'casting-calls'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <span>Casting Calls</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
              {directorCalls.length}
            </span>
          </button>
        )}
      </div>

      {/* --- TAB CONTENT 1: OVERVIEW (Figure 19 Label #6 & #7) --- */}
      {activeTab === 'overview' && (() => {
        const displayChars = normalizeCharacteristics(profileUser.characteristics, profileUser.id);
        // Group skills by reference list category
        const groupedSkills: { title: string; items: string[] }[] = [];
        const assigned = new Set<string>();
        const userSkills = profileUser.specialSkills || [];

        for (const cat of SPECIAL_SKILLS_CATEGORIES) {
          const items = userSkills.filter(
            s => !assigned.has(s) && findCategoryForSkill(s)?.id === cat.id
          );
          if (items.length > 0) {
            items.forEach(i => assigned.add(i));
            groupedSkills.push({ title: cat.title, items });
          }
        }
        const customSkills = userSkills.filter(s => !assigned.has(s));
        if (customSkills.length > 0) {
          groupedSkills.push({ title: 'Additional & Custom Specialties', items: customSkills });
        }

        return (
          <div className="space-y-6 animate-in fade-in">
            {/* Label #6: Characteristics Card */}
            <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 sm:p-8 border border-[#E5E5E0] dark:border-stone-700 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                    Characteristics
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Physical attributes, languages, body modifications, and performance comfort
                  </p>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditCharacteristicsOpen(true)}
                    className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-600 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Characteristics</span>
                  </button>
                )}
              </div>

              {displayChars ? (
                <div className="space-y-6">
                  {/* Group 1: Height & Physical / Identity Dropdown Attributes */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                      Physical &amp; Identity Attributes
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#F8F7F4] dark:bg-stone-900/50 border border-[#E5E5E0] dark:border-stone-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Height</span>
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {displayChars.height || 'Not specified'}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#F8F7F4] dark:bg-stone-900/50 border border-[#E5E5E0] dark:border-stone-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Gender</span>
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {displayChars.gender || 'Prefer not to say'}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#F8F7F4] dark:bg-stone-900/50 border border-[#E5E5E0] dark:border-stone-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Race / Ethnicity</span>
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {displayChars.ethnicity || 'Prefer not to say'}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#F8F7F4] dark:bg-stone-900/50 border border-[#E5E5E0] dark:border-stone-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Hair Color</span>
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {displayChars.hair_color || 'Prefer not to say'}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#F8F7F4] dark:bg-stone-900/50 border border-[#E5E5E0] dark:border-stone-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Eye Color</span>
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                          {displayChars.eye_color || 'Prefer not to say'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Group 2: Body Modifications & Nudity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-stone-900/50 border border-[#E5E5E0] dark:border-stone-700 space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Body Modifications
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 flex items-center justify-between">
                          <span className="text-stone-600 dark:text-stone-300 font-medium">Piercings</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              displayChars.has_piercings === 'Yes'
                                ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                                : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                            }`}
                          >
                            {displayChars.has_piercings}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 flex items-center justify-between">
                          <span className="text-stone-600 dark:text-stone-300 font-medium">Tattoos</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              displayChars.has_tattoos === 'Yes'
                                ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                                : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                            }`}
                          >
                            {displayChars.has_tattoos}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-stone-900/50 border border-[#E5E5E0] dark:border-stone-700 space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        <span>Nudity Comfort</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 flex items-center justify-between">
                          <span className="text-stone-600 dark:text-stone-300 font-medium">Partial Nudity</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              displayChars.partial_nudity === 'Yes'
                                ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                                : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                            }`}
                          >
                            {displayChars.partial_nudity}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 flex items-center justify-between">
                          <span className="text-stone-600 dark:text-stone-300 font-medium">Full Nudity</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              displayChars.full_nudity === 'Yes'
                                ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                                : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                            }`}
                          >
                            {displayChars.full_nudity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group 3: Languages & Fluency Distinction */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5" />
                      <span>Languages &amp; Fluency</span>
                    </h3>
                    {displayChars.languages && displayChars.languages.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                        {displayChars.languages.map(lang => (
                          <div
                            key={lang.id}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8F7F4] dark:bg-stone-900/60 border border-[#E5E5E0] dark:border-stone-700 text-xs"
                          >
                            <span className="font-bold text-stone-900 dark:text-white">
                              {lang.language}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                lang.proficiency === 'Native / Fluent'
                                  ? 'bg-[var(--color-primary)] text-white'
                                  : lang.proficiency === 'Conversational'
                                  ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)] border border-[var(--color-primary-border)]'
                                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              {lang.proficiency}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic">No languages listed yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-stone-200 dark:border-stone-700 rounded-2xl">
                  <p className="text-sm text-stone-500 mb-2">No characteristics listed yet.</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditCharacteristicsOpen(true)}
                      className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
                    >
                      + Add Characteristics
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Label #7: Special Skills List (Grouped by Reference List Categories) */}
            <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 sm:p-8 border border-[#E5E5E0] dark:border-stone-700 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                    Special Skills &amp; Performance Disciplines
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Organized by Actor Resume Reference List categories
                  </p>
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditSpecialSkillsOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-600 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-1.5 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Skills</span>
                  </button>
                )}
              </div>

              {groupedSkills.length > 0 ? (
                <div className="space-y-4">
                  {groupedSkills.map(group => (
                    <div key={group.title} className="space-y-2">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        {group.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map(skill => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--color-primary-subtle)] text-[var(--color-primary)] border border-[var(--color-primary-border)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-stone-200 dark:border-stone-700 rounded-2xl">
                  <p className="text-xs text-stone-500 mb-2">No special skills listed.</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditSpecialSkillsOpen(true)}
                      className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
                    >
                      + Add Special Skills
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* --- TAB CONTENT 2: RESUME (Figure 20) --- */}
      {activeTab === 'resume' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Sub-Tabs: Performer vs Director Resume (Figure 20 Label #1 & #2) */}
          <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Resume Type:</span>
              <button
                onClick={() => setResumeRoleTab('Performer')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  resumeRoleTab === 'Performer'
                    ? 'btn-primary shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Performer Resume
              </button>

              {profileUser.roles.includes('Director') && (
                <button
                  onClick={() => setResumeRoleTab('Director')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                    resumeRoleTab === 'Director'
                      ? 'btn-primary shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Director Resume
                </button>
              )}
            </div>

            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsResumeTemplateModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl btn-accent text-xs font-semibold shadow-xs"
                >
                  Template Builder (FR-007)
                </button>
              </div>
            )}
          </div>

          {currentResume ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-8">
              {/* Header inside resume */}
              <div className="border-b border-slate-200 dark:border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {profileUser.name} — {currentResume.roleType} Resume
                  </h2>
                  <p className="text-xs text-slate-500">{profileUser.email} • {profileUser.location}</p>
                </div>
                {currentResume.uploadedFileName && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono truncate max-w-[200px]">{currentResume.uploadedFileName}</span>
                    <button className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-200" title="Download Resume PDF">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Theatre Credits */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3 pb-1 border-b border-slate-100 dark:border-slate-700">
                  Theatrical Productions
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                  {currentResume.theatreCredits.map(credit => (
                    <div key={credit.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{credit.title}</span>
                        <span className="text-slate-500 ml-2">({credit.role})</span>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <span>{credit.venue} • Dir. {credit.director}</span>
                        <span className="ml-3 font-semibold text-slate-700 dark:text-slate-300">{credit.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Film Credits */}
              {currentResume.filmCredits && currentResume.filmCredits.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3 pb-1 border-b border-slate-100 dark:border-slate-700">
                    Film & Cinematic Credits
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                    {currentResume.filmCredits.map(credit => (
                      <div key={credit.id} className="py-2.5 flex items-center justify-between gap-4">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{credit.title}</span>
                          <span className="text-slate-500 ml-2">({credit.role})</span>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                          <span>{credit.production} • Dir. {credit.director}</span>
                          <span className="ml-3 font-semibold text-slate-700 dark:text-slate-300">{credit.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Training */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3 pb-1 border-b border-slate-100 dark:border-slate-700">
                  Training & Education
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  {currentResume.training.map(tr => (
                    <div key={tr.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white">{tr.degree}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">{tr.institution} — {tr.notes}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards */}
              {currentResume.awards && currentResume.awards.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2 pb-1 border-b border-slate-100 dark:border-slate-700">
                    Honors & Accolades
                  </h3>
                  <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {currentResume.awards.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Special Skills Summary */}
              {currentResume.specialSkillsSummary && (
                <div className="p-4 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary-border)] text-xs text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-[var(--color-primary)] block mb-1 uppercase tracking-wider text-[10px]">Special Skills Summary</span>
                  <p>{currentResume.specialSkillsSummary}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white">No {resumeRoleTab} Resume Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Build your verified resume using our ECU School of Theatre & Dance template!
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => setIsResumeTemplateModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
                >
                  Create Resume from Template (FR-007)
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT 3: MEDIA (Figure 21) --- */}
      {activeTab === 'media' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Uploaded Media & Reels</h2>
              <p className="text-xs text-slate-500">FR-003: Videos up to 3 minutes supported • Audio and photo headshots</p>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setIsUploadMediaModalOpen(true)}
                className="px-3.5 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Media</span>
              </button>
            )}
          </div>

          {/* Figure 21 Label #1: Videos Screens */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[var(--color-primary)]" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Video Reels & Monologues</h3>
              <span className="text-[10px] text-slate-400 font-medium">(Max 3 Minutes)</span>
            </div>

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map(v => (
                  <div
                    key={v.id}
                    onClick={() => setPlayingVideoUrl(v.file_path)}
                    className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-video cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={v.thumbnail_path || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80'}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
                      <div className="self-end">
                        {v.durationSeconds && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs font-semibold">
                            {Math.floor(v.durationSeconds / 60)}:{(v.durationSeconds % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[70%]">{v.title}</span>
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-slate-900 flex items-center justify-center group-hover:scale-110 transition shadow-md">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No video reels uploaded yet.</p>
            )}
          </div>

          {/* Audio Reels */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-[var(--color-primary)]" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Audio & Vocal Recordings</h3>
            </div>

            {audios.length > 0 ? (
              <div className="space-y-3">
                {audios.map(a => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{a.title}</p>
                      <p className="text-[10px] text-slate-400">Uploaded {a.uploadDate}</p>
                    </div>
                    <audio controls className="h-8 max-w-xs w-full">
                      <source src={a.file_path} type="audio/mpeg" />
                    </audio>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2 text-center">No audio clips uploaded yet.</p>
            )}
          </div>

          {/* Figure 21 Label #2: Additional Photos */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[var(--color-primary)]" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Additional Photos & Production Stills</h3>
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photos.map(p => (
                  <div key={p.id} className="rounded-2xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700 group relative">
                    <img src={p.file_path} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-[11px] text-white font-medium truncate">
                      {p.title}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2 text-center">No additional photos uploaded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 4: CASTING CALLS (Figure 22) --- */}
      {activeTab === 'casting-calls' && profileUser.roles.includes('Director') && (
        <div className="space-y-6 animate-in fade-in">
          {/* Figure 22 Label #1: Current Casting Calls List */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Director Casting Calls</h2>
                <p className="text-xs text-slate-500">Current productions and character casting pipelines managed by {profileUser.name}</p>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => navigateTo('create-casting-call')}
                  className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Casting Call</span>
                </button>
              )}
            </div>

            {directorCalls.length > 0 ? (
              <div className="space-y-4">
                {directorCalls.map(call => (
                  <div
                    key={call.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Figure 22 Label #2: Production Information & Roles */}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                          {call.productionType}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${call.status === 'Open' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {call.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{call.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Casting: {call.characters.map(c => `${c.name} (${c.roleType})`).join(', ')}
                      </p>
                    </div>

                    {/* Figure 22 Label #3 & #4: Audition Deadline and Location */}
                    <div className="text-xs text-slate-500 space-y-1 md:text-right flex-shrink-0">
                      <p className="flex items-center md:justify-end gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Audition Deadline: <strong>{call.deadline}</strong></span>
                      </p>
                      <p className="flex items-center md:justify-end gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Location: <strong>{call.location}</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => navigateTo('casting-call-detail', call.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        View Call
                      </button>
                      {isOwnProfile && (
                        <button
                          onClick={() => navigateTo('applicant-review', call.id)}
                          className="px-3.5 py-1.5 rounded-lg btn-accent text-xs font-semibold shadow-xs"
                        >
                          Review Applicants →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No active casting calls currently listed for this director.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Lightbox Player Modal */}
      {playingVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full p-4 overflow-hidden relative shadow-2xl">
            <button
              onClick={() => setPlayingVideoUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <video controls autoPlay className="w-full rounded-2xl aspect-video bg-black">
              <source src={playingVideoUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </div>
        </div>
      )}

      {/* Edit About Modal */}
      {isEditAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Edit Profile Info</h2>
            <form onSubmit={handleSaveAbout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">About Me</label>
                <textarea
                  rows={4}
                  value={editAboutText}
                  onChange={e => setEditAboutText(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Campus / Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Personal Sites / Reel Links (comma separated)</label>
                <input
                  type="text"
                  value={editSites}
                  onChange={e => setEditSites(e.target.value)}
                  placeholder="https://mysite.com, https://vimeo.com/..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Availability Status (AF-003)</label>
                <select
                  value={editAvailability}
                  onChange={e => setEditAvailability(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Available">Available for Projects</option>
                  <option value="Busy with another project">Busy with another project</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditAboutModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Media Modal (FR-003 3-Minute Limit) */}
      {isUploadMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upload Media Item</h2>
            <p className="text-xs text-slate-500 mb-4">FR-003: Video uploads must be 3 minutes (180 seconds) or less.</p>

            {uploadError && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleMediaUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Media Type</label>
                <div className="flex gap-2">
                  {(['video', 'audio', 'photo'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUploadType(t)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border ${
                        uploadType === t
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                          : 'border-slate-300 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Shakespeare Monologue Reel"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {uploadType === 'video' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration in Seconds (Max 180s / 3 min)
                  </label>
                  <input
                    type="number"
                    max={180}
                    min={1}
                    value={uploadDurationSecs}
                    onChange={e => setUploadDurationSecs(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Strict system rule FR-003: Video files exceeding 3 minutes are rejected.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">File URL or Media Source</label>
                <input
                  type="text"
                  value={uploadUrl}
                  onChange={e => setUploadUrl(e.target.value)}
                  placeholder="Paste URL or leave empty for demo sample"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadMediaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resume Template Builder Modal (FR-007) */}
      {isResumeTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resume Template Builder (FR-007)</h2>
            <p className="text-xs text-slate-500 mb-4">
              Standardized ECU School of Theatre & Dance resume generator for students and new users.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-xl font-medium">
                Generating professional template with your verified ECU degree, student productions, and faculty credits.
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Pre-formatted Structure:</p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  <p>• Heading: {profileUser.name} | ECU School of Theatre & Dance</p>
                  <p>• Category: {resumeRoleTab} Resume</p>
                  <p>• Theatrical Credits: Production, Role, Venue, Director, Year</p>
                  <p>• Cinematic Credits: Title, Production House, Director, Year</p>
                  <p>• Education: East Carolina University (BFA/MFA)</p>
                  <p>• Specialized Skills & Vocal Range Summary</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setIsResumeTemplateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    saveResume(profileUser.id, {
                      id: `res-${Date.now()}`,
                      user_id: profileUser.id,
                      roleType: resumeRoleTab,
                      theatreCredits: [
                        { id: '1', title: 'The Pirates of Penzance', role: 'Mabel', venue: 'ECU McGinnis Theatre', director: 'Austin Jones', year: '2026' },
                        { id: '2', title: 'A Midsummer Night’s Dream', role: 'Helena', venue: 'Messick Black Box', director: 'Marcus Reynolds', year: '2025' }
                      ],
                      filmCredits: [
                        { id: '3', title: 'Beneath the Tar River', role: 'Clara', production: 'ECU Cinematic Arts', director: 'Chloe Bennett', year: '2026' }
                      ],
                      training: [
                        { id: '4', degree: 'BFA in Theatre Arts', institution: 'East Carolina University', notes: 'Voice & Classical Acting' }
                      ],
                      awards: ['ECU Theatre Emerging Artist (2025)'],
                      specialSkillsSummary: 'Vocal range soprano (High C), Stage combat SAFD certified, Dialects: British RP, Southern Coastal.',
                      uploadedFileName: `${profileUser.firstName}_${profileUser.lastName}_Resume_ECU.pdf`
                    });
                    setIsResumeTemplateModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold"
                >
                  Apply Template to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Characteristics Modal */}
      <EditCharacteristicsModal
        isOpen={isEditCharacteristicsOpen}
        onClose={() => setIsEditCharacteristicsOpen(false)}
        user={profileUser}
      />

      {/* Edit Special Skills Modal */}
      <EditSpecialSkillsModal
        isOpen={isEditSpecialSkillsOpen}
        onClose={() => setIsEditSpecialSkillsOpen(false)}
        user={profileUser}
      />

      {/* Add to Favorite Modal */}
      <AddToFavoriteModal
        isOpen={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        targetUser={profileUser}
      />
    </div>
  );
};
