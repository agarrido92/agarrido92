import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AddToFavoriteModal } from '../components/AddToFavoriteModal';
import { User, RoleType } from '../types';
import {
  Search,
  Filter,
  Heart,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
  User as UserIcon,
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const {
    users,
    currentUser,
    navigateTo,
    isUserInFavorites,
    searchQuery,
    setSearchQuery
  } = useApp();

  // Figure 30 Label #4: Filter & Sort state (from Dropdown Proposal section C & Figure 30)
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'All' | 'Performer' | 'Director' | 'Both'>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'All' | 'Available' | 'Busy with another project'>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'Relevance' | 'Name'>('Relevance');

  const [selectedUserForFavorite, setSelectedUserForFavorite] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    let list = users.filter(u => u.status === 'Active');

    // Filter private profiles if not own
    list = list.filter(u => !u.isPrivate || u.id === currentUser?.id);

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.about.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        u.specialSkills.some(s => s.toLowerCase().includes(q)) ||
        (u.characteristics?.languages?.some(l => l.language.toLowerCase().includes(q)) ?? false)
      );
    }

    // Role filter
    if (roleFilter === 'Both') {
      list = list.filter(u => u.roles.includes('Performer') && u.roles.includes('Director'));
    } else if (roleFilter !== 'All') {
      list = list.filter(u => u.roles.includes(roleFilter as RoleType));
    }

    // Availability filter
    if (availabilityFilter !== 'All') {
      list = list.filter(u => u.availability === availabilityFilter);
    }

    // Skill filter
    if (selectedSkill !== 'All') {
      list = list.filter(u => u.specialSkills.includes(selectedSkill));
    }

    // Location filter
    if (locationFilter !== 'All') {
      list = list.filter(u => u.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    // Sort by
    if (sortBy === 'Name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [users, searchQuery, roleFilter, availabilityFilter, selectedSkill, locationFilter, sortBy, currentUser]);

  const skillOptions = useMemo(() => {
    const uniqueSkills = Array.from(
      new Set(users.flatMap(u => u.specialSkills || []))
    ).sort((a, b) => a.localeCompare(b));
    return ['All', ...uniqueSkills];
  }, [users]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Filter/Sort Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Find People</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search performers and directors across East Carolina University.
          </p>
        </div>

        {/* Figure 30 Label #4: Filter & Sort Button */}
        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Filter & Sort</span>
          {(roleFilter !== 'All' || availabilityFilter !== 'All' || selectedSkill !== 'All') && (
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          )}
        </button>
      </div>

      {/* Global Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by performer name, discipline, vocal type, or role..."
          className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400 shadow-xs"
        />
      </div>

      {/* Filter Drawer / Panel (Label #4) */}
      {showFilterDrawer && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Search Filters & Sort Options</span>
            </span>
            <button
              onClick={() => {
                setRoleFilter('All');
                setAvailabilityFilter('All');
                setSelectedSkill('All');
                setLocationFilter('All');
                setSortBy('Relevance');
              }}
              className="text-xs text-[var(--color-primary)] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Role Filter */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Role Type:</label>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Roles</option>
                <option value="Performer">Performer Only</option>
                <option value="Director">Director Only</option>
                <option value="Both">Both (Performer & Director)</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Availability Status:</label>
              <select
                value={availabilityFilter}
                onChange={e => setAvailabilityFilter(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="All">Any Availability</option>
                <option value="Available">Available Only</option>
                <option value="Busy with another project">Busy with another project</option>
              </select>
            </div>

            {/* Special Skills Taxonomy */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Skill Requirement:</label>
              <select
                value={selectedSkill}
                onChange={e => setSelectedSkill(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                {skillOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Sort Results By:</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="Relevance">Relevance</option>
                <option value="Name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Person Cards List (Figure 30 Labels #1, #2, #3) */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => {
            const isFavorited = isUserInFavorites(user.id);
            const isMe = currentUser?.id === user.id;

            return (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group hover:border-[var(--color-primary)]"
              >
                <div
                  onClick={() => navigateTo('profile', user.id)}
                  className="flex items-start sm:items-center gap-4 cursor-pointer flex-1"
                >
                  {/* Figure 30 Label #1: Headshot Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.headshot}
                      alt={user.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[var(--color-accent)] shadow-sm group-hover:scale-105 transition"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${
                        user.availability === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      title={user.availability}
                    />
                  </div>

                  {/* Figure 30 Label #2: Profile Information */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[var(--color-primary)] transition">
                        {user.name}
                      </h2>
                      <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {user.classification}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {user.roles.join(' & ')}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{user.location}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 leading-relaxed">
                      {user.about}
                    </p>

                    <div className="pt-1 flex flex-wrap gap-1">
                      {user.specialSkills.slice(0, 4).map(skill => (
                        <span
                          key={skill}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Figure 30 Label #3: Favorite Button & Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {!isMe && currentUser && (
                    <>
                      <button
                        onClick={() => setSelectedUserForFavorite(user)}
                        className={`p-2.5 rounded-xl border transition shadow-xs ${
                          isFavorited
                            ? 'border-rose-300 bg-rose-50 text-rose-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                        title="Save to Favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => navigateTo('messages', user.id)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                        title="Send Message"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => navigateTo('profile', user.id)}
                    className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold shadow-xs flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <UserIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white">No People Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or filter constraints.</p>
          </div>
        )}
      </div>

      {/* Add to Favorite Modal */}
      {selectedUserForFavorite && (
        <AddToFavoriteModal
          isOpen={Boolean(selectedUserForFavorite)}
          onClose={() => setSelectedUserForFavorite(null)}
          targetUser={selectedUserForFavorite}
        />
      )}
    </div>
  );
};
