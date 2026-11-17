import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Plus, FolderHeart, Users, ChevronRight, X } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favoriteGroups, currentUser, navigateTo, createFavoriteGroup } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const userGroups = favoriteGroups.filter(g => g.userId === currentUser?.id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    createFavoriteGroup(newGroupName.trim());
    setNewGroupName('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Create Group Button (Figure 33 Label #3) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Favorites</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize bookmarked performers and directors into custom project folders.
          </p>
        </div>

        {/* Figure 33 Label #3: Create Group Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Group</span>
        </button>
      </div>

      {/* Figure 33 Grid of Favorite Groups */}
      {userGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userGroups.map(grp => (
            <div
              key={grp.id}
              onClick={() => navigateTo('favorite-group-detail', grp.id)}
              className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-[var(--color-primary)] flex flex-col justify-between"
            >
              {/* Figure 33 Label #1: Group Image */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={grp.image}
                  alt={grp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                  <div className="flex items-center gap-2 text-white text-xs font-semibold">
                    <Users className="w-4 h-4 text-[var(--color-accent)]" />
                    <span>{grp.memberUserIds.length} Performer{grp.memberUserIds.length !== 1 ? 's' : ''} Saved</span>
                  </div>
                </div>
              </div>

              {/* Figure 33 Label #2: Group Name */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[var(--color-primary)] transition">
                    {grp.name}
                  </h2>
                  <span className="text-[11px] text-slate-400">Created {grp.createdDate}</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary-light)] transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
          <FolderHeart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white">No Favorite Groups Created</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create groups like &quot;Lead Actors&quot;, &quot;Pirates of Penzance Chorus&quot;, or &quot;Student Directors&quot; to organize talent.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 px-5 py-2 rounded-xl btn-primary text-xs font-semibold"
          >
            Create Your First Group
          </button>
        </div>
      )}

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Create Favorite Group</h2>
            <p className="text-xs text-slate-500 mb-4">Name a talent folder to organize bookmarked performers.</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="e.g. Lead Drama Actors, Musical Vocals"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold shadow-md"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
