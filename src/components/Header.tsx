import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ChevronDown,
  User as UserIcon,
  Bell,
  Mail,
  Heart,
  Settings as SettingsIcon,
  Shield,
  FileText,
  LogOut,
  Sparkles,
  Menu,
  X,
  Compass
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activePage,
    navigateTo,
    logout,
    users,
    switchUser,
    messages,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const aboutRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = currentUser
    ? messages.filter(m => m.receiverId === currentUser.id && !m.read).length
    : 0;

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('search');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-stone-900 border-b border-[#E5E5E0] dark:border-stone-800 shadow-xs transition-colors">
      {/* Demo Persona Quick Switcher Bar */}
      <div className="bg-[#F3F2EE] dark:bg-stone-850 text-xs text-stone-600 dark:text-stone-300 px-4 py-1.5 border-b border-[#E5E5E0] dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>ECU Performer Connect Environment:</span>
          <span className="text-stone-900 dark:text-white font-semibold">
            {currentUser ? `${currentUser.name} (${currentUser.classification} • ${currentUser.roles.join('/')})` : 'Guest / Logged Out'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-stone-500">Fast Persona Switch:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => switchUser('user-maya-lin')}
              className={`px-2.5 py-0.5 rounded-md text-xs transition ${
                currentUser?.id === 'user-maya-lin'
                  ? 'bg-[var(--color-primary)] text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
              }`}
            >
              Maya (Actor)
            </button>
            <button
              onClick={() => switchUser('user-marcus-reynolds')}
              className={`px-2.5 py-0.5 rounded-md text-xs transition ${
                currentUser?.id === 'user-marcus-reynolds'
                  ? 'bg-[var(--color-primary)] text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
              }`}
            >
              Marcus (Dir/Act)
            </button>
            <button
              onClick={() => switchUser('user-austin-jones')}
              className={`px-2.5 py-0.5 rounded-md text-xs transition ${
                currentUser?.id === 'user-austin-jones'
                  ? 'bg-[var(--color-primary)] text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
              }`}
            >
              Prof. Jones (Admin/Dir)
            </button>
            <button
              onClick={() => switchUser(null)}
              className={`px-2.5 py-0.5 rounded-md text-xs transition ${
                !currentUser
                  ? 'bg-stone-800 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
              }`}
            >
              Guest
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title with generous breathing room and collegiate typography */}
        <div
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3.5 cursor-pointer group flex-shrink-0"
        >
          {/* Spacious collegiate brand badge with clean white text */}
          <div className="flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-[var(--color-primary)] text-white shadow-xs border border-black/10 group-hover:scale-105 transition-transform">
            <span className="font-serif font-black tracking-widest text-base select-none">ECU</span>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-white leading-tight group-hover:text-[var(--color-primary)] transition-colors">
              ECU Performer Connect
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              School of Theatre &amp; Dance
            </p>
          </div>
        </div>

        {/* Middle: Find People search input (SRS Figure 10 Label #1: only appears when signed in) */}
        {currentUser && (
          <form
            onSubmit={handleGlobalSearch}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Find people..."
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 transition ring-theme-primary placeholder-slate-400"
            />
          </form>
        )}

        {/* Right: Main Navigation & Dropdowns */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                activePage === 'home'
                  ? 'text-[var(--color-primary)] font-bold bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigateTo('casting-calls')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                activePage.startsWith('casting-call')
                  ? 'text-[var(--color-primary)] font-bold bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Casting Calls
            </button>

            {/* About Dropdown (SRS Figure 10 Label #2 & Dropdown proposal section B) */}
            <div className="relative" ref={aboutRef}>
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  ['about', 'contact', 'terms'].includes(activePage)
                    ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary-subtle)]'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <span>About</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-max min-w-[9.25rem] rounded-xl shadow-lg bg-white dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 py-1 z-50 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => {
                      navigateTo('about');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-right px-3.5 py-1.5 hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] text-stone-700 dark:text-stone-200 font-medium transition whitespace-nowrap block"
                  >
                    About Us
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('contact');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-right px-3.5 py-1.5 hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] text-stone-700 dark:text-stone-200 font-medium transition whitespace-nowrap block"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('terms');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full text-right px-3.5 py-1.5 hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] text-stone-700 dark:text-stone-200 font-medium transition whitespace-nowrap block"
                  >
                    Terms &amp; Conditions
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* User Photo & User Options Dropdown (SRS Figure 10 Label #3 & #4) */}
          {currentUser ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[var(--color-primary)] transition"
                aria-label="User Options Menu"
              >
                <div className="relative">
                  <img
                    src={currentUser.headshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-accent)]"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex gap-1">
                      {currentUser.roles.map(r => (
                        <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium">
                          {r}
                        </span>
                      ))}
                      {currentUser.isAdmin && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigateTo('profile', currentUser.id);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('my-applications');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>My Applications</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('favorites');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Favorites</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('messages');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>Messages</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('settings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-500" />
                    <span>Settings</span>
                  </button>

                  {currentUser.isAdmin && (
                    <button
                      onClick={() => {
                        navigateTo('admin-dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-[var(--color-primary)] font-semibold"
                    >
                      <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="px-4 py-1.5 rounded-xl text-sm font-semibold btn-primary shadow-xs hover:shadow transition"
            >
              Log In
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          {currentUser && (
            <form onSubmit={handleGlobalSearch} className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Find people..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </form>
          )}

          <button
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            Home
          </button>
          <button
            onClick={() => {
              navigateTo('casting-calls');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            Casting Calls
          </button>
          <button
            onClick={() => {
              navigateTo('search');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            Discover People & Directors
          </button>
          <button
            onClick={() => {
              navigateTo('about');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            About Us
          </button>
          <button
            onClick={() => {
              navigateTo('contact');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            Contact Us
          </button>
          <button
            onClick={() => {
              navigateTo('terms');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            Terms & Conditions
          </button>

          {!currentUser && (
            <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
              <button
                onClick={() => {
                  navigateTo('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-4 rounded-xl btn-primary text-center font-semibold text-sm shadow-xs"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
