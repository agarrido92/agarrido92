import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { X, Heart, FolderPlus, Check } from 'lucide-react';

interface AddToFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
}

export const AddToFavoriteModal: React.FC<AddToFavoriteModalProps> = ({
  isOpen,
  onClose,
  targetUser,
}) => {
  const { currentUser, favoriteGroups, toggleUserInFavoriteGroup, createFavoriteGroup } = useApp();
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen || !currentUser) return null;

  const userGroups = favoriteGroups.filter(g => g.userId === currentUser.id);

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const created = createFavoriteGroup(newGroupName.trim());
    toggleUserInFavoriteGroup(targetUser.id, created.id);
    setNewGroupName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Save to Favorites</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Save {targetUser.name} to your talent list</p>
          </div>
        </div>

        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {userGroups.length === 0 && !isCreating && (
            <p className="text-xs text-slate-500 text-center py-3">No favorite groups yet. Create your first group below!</p>
          )}

          {userGroups.map(grp => {
            const isSaved = grp.memberUserIds.includes(targetUser.id);
            return (
              <button
                key={grp.id}
                onClick={() => toggleUserInFavoriteGroup(targetUser.id, grp.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-medium transition ${
                  isSaved
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>{grp.name}</span>
                {isSaved ? (
                  <span className="flex items-center gap-1 font-bold">
                    <Check className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Saved</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">+ Add</span>
                )}
              </button>
            );
          })}
        </div>

        {isCreating ? (
          <form onSubmit={handleCreateAndAdd} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <input
              type="text"
              autoFocus
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="e.g. Pirates Musical Leads, Film Actors"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 text-xs rounded-lg btn-primary font-medium"
              >
                Create & Save
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-[var(--color-primary)] text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Create New Group</span>
          </button>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
