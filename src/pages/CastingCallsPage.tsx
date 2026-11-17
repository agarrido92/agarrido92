import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Calendar, MapPin, Plus, Film, ChevronRight, SlidersHorizontal, Users } from 'lucide-react';

export const CastingCallsPage: React.FC = () => {
  const { castingCalls, navigateTo, currentUser } = useApp();

  // Figure 23 Controls & Dropdown proposal section A
  const [search, setSearch] = useState('');
  const [productionType, setProductionType] = useState('All production types');
  const [roleType, setRoleType] = useState('All roles');
  const [location, setLocation] = useState('All locations');
  const [sortOption, setSortOption] = useState('Newest first');

  const filteredCalls = useMemo(() => {
    let list = [...castingCalls];

    // Search keywords
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.storyline.toLowerCase().includes(q) ||
        c.directorName.toLowerCase().includes(q) ||
        c.characters.some(ch => ch.name.toLowerCase().includes(q) || ch.synopsis.toLowerCase().includes(q))
      );
    }

    // Production dropdown filter (Figure 23 Label #2)
    if (productionType !== 'All production types') {
      list = list.filter(c => c.productionType === productionType);
    }

    // Role dropdown filter (Figure 23 Label #3)
    if (roleType !== 'All roles') {
      list = list.filter(c => c.characters.some(ch => ch.roleType === roleType));
    }

    // Location dropdown filter (Figure 23 Label #4)
    if (location !== 'All locations') {
      list = list.filter(c => c.location === location);
    }

    // Sort options (Figure 23 Label #5)
    if (sortOption === 'Newest first') {
      list.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    } else if (sortOption === 'Oldest first') {
      list.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
    } else if (sortOption === 'Deadline soonest') {
      list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortOption === 'Deadline latest') {
      list.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    }

    return list;
  }, [castingCalls, search, productionType, roleType, location, sortOption]);

  const canCreate = currentUser?.roles.includes('Director') || currentUser?.isAdmin;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Casting Calls</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Find current casting opportunities across ECU theatre productions and student films.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => navigateTo('create-casting-call')}
            className="px-4 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Casting Call</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar (Figure 23 Label #1 - #5) */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        {/* Label #1: Search Casting Calls text field */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search casting calls by keyword, title, character, or director..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
          />
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Label #2: Production Dropdown */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Production:</label>
            <select
              value={productionType}
              onChange={e => setProductionType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="All production types">All production types</option>
              <option value="Play">Play</option>
              <option value="Musical">Musical</option>
              <option value="Film">Film</option>
              <option value="Student Film">Student Film</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Label #3: Role Dropdown */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Role:</label>
            <select
              value={roleType}
              onChange={e => setRoleType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="All roles">All roles</option>
              <option value="Lead">Lead</option>
              <option value="Supporting Character">Supporting Character</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Label #4: Location Dropdown */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Location:</label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="All locations">All locations</option>
              <option value="Greenville/ECU">Greenville/ECU</option>
              <option value="Other NC">Other NC</option>
              <option value="Remote/Online">Remote/Online</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Label #5: Sort Options */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">Sort:</label>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="Newest first">Newest first</option>
              <option value="Oldest first">Oldest first</option>
              <option value="Deadline soonest">Deadline soonest</option>
              <option value="Deadline latest">Deadline latest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Label #6: Casting Calls List */}
      <div className="space-y-4">
        {filteredCalls.length > 0 ? (
          filteredCalls.map(call => (
            <div
              key={call.id}
              onClick={() => navigateTo('casting-call-detail', call.id)}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition cursor-pointer hover:border-[var(--color-primary)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    {call.productionType}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Posted {call.postedDate}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">• Dir. {call.directorName}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[var(--color-primary)] transition">
                  {call.title}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {call.storyline}
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Casting:</span>
                  {call.characters.map(char => (
                    <span
                      key={char.id}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {char.name} ({char.roleType})
                    </span>
                  ))}
                </div>
              </div>

              {/* Deadline & Location Details */}
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 md:text-right flex-shrink-0">
                <p className="flex items-center md:justify-end gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Audition Deadline: <strong className="text-slate-800 dark:text-slate-200">{call.deadline}</strong></span>
                </p>
                <p className="flex items-center md:justify-end gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Location: <strong className="text-slate-800 dark:text-slate-200">{call.location}</strong></span>
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] group-hover:underline">
                    <span>View Call & Roles</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <Film className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white">No Casting Calls Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};
