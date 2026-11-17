import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MoreHorizontal, Heart, Trash2, Edit2, User, ChevronRight, X } from 'lucide-react';

export const FavoriteGroupDetailPage: React.FC<{ groupId: string }> = ({ groupId }) => {
  const { favoriteGroups, users, navigateTo, toggleUserInFavoriteGroup, renameFavoriteGroup, deleteFavoriteGroup } = useApp();

  const group = favoriteGroups.find(g => g.id === groupId) || favoriteGroups[0];
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameInput, setRenameInput] = useState(group?.name || '');

  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!group) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-slate-500">Group not found.</p>
        <button onClick={() => navigateTo('favorites')} className="mt-4 px-4 py-2 btn-primary text-xs rounded-xl">
          Back to Favorites
        </button>
      </div>
    );
  }

  const memberUsers = users.filter(u => group.memberUserIds.includes(u.id));

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameInput.trim()) return;
    renameFavoriteGroup(group.id, renameInput.trim());
    setIsRenameModalOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the group "${group.name}"?`)) {
      deleteFavoriteGroup(group.id);
      navigateTo('favorites');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header with Back, Title, Label #1 (# in group), and Label #5 (Group Options ...) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('favorites')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title="Back to Favorites"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {group.name}
            </h1>
            {/* Figure 34 Label #1: Number in Group */}
            <p className="text-xs text-slate-500 font-semibold">
              {group.memberUserIds.length} Performer{group.memberUserIds.length !== 1 ? 's' : ''} in Group
            </p>
          </div>
        </div>

        {/* Figure 34 Label #5: Group Options (...) */}
        <div className="relative" ref={optionsRef}>
          <button
            onClick={() => setOptionsOpen(!optionsOpen)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-xs"
            title="Group Options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {optionsOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs animate-in fade-in">
              <button
                onClick={() => {
                  setRenameInput(group.name);
                  setIsRenameModalOpen(true);
                  setOptionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2 font-medium"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Rename Group</span>
              </button>
              <button
                onClick={() => {
                  setOptionsOpen(false);
                  handleDelete();
                }}
                className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Group</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Saved Profiles in Group (Figure 34 Labels #2, #3, #4) */}
      {memberUsers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {memberUsers.map(user => (
            <div
              key={user.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition text-center group relative flex flex-col justify-between hover:border-[var(--color-primary)]"
            >
              {/* Figure 34 Label #4: Favorite Button (Heart to remove from group) */}
              <button
                onClick={() => toggleUserInFavoriteGroup(user.id, group.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs text-rose-500 hover:scale-110 transition shadow-xs z-10"
                title="Remove from group"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>

              <div
                onClick={() => navigateTo('profile', user.id)}
                className="cursor-pointer"
              >
                {/* Figure 34 Label #2: Headshot Image */}
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-3 border-2 border-[var(--color-accent)] shadow-xs">
                  <img
                    src={user.headshot}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                {/* Figure 34 Label #3: Name of Profile */}
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[var(--color-primary)] transition truncate">
                  {user.name}
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {user.classification} • {user.roles.join(', ')}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  onClick={() => navigateTo('profile', user.id)}
                  className="w-full py-1 rounded-lg text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center justify-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white">This group is empty</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse performers in search or profiles and click the heart icon to add them to {group.name}.
          </p>
          <button
            onClick={() => navigateTo('search')}
            className="mt-4 px-5 py-2 rounded-xl btn-primary text-xs font-semibold"
          >
            Find Performers
          </button>
        </div>
      )}

      {/* Rename Modal */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">Rename Favorite Group</h3>
            <form onSubmit={handleRename} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={renameInput}
                onChange={e => setRenameInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg btn-primary text-xs font-semibold"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
