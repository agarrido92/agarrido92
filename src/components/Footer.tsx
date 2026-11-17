import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-white dark:bg-stone-900 border-t border-[#E5E5E0] dark:border-stone-800 mt-12 sm:mt-16 shadow-xs transition-colors">
      {/* Top brand accent strip */}
      <div className="h-1 bg-[var(--color-primary)] w-full" />

      {/* Comfortably proportioned footer container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-5 border-b border-[#E5E5E0] dark:border-stone-800">
          {/* Brand mark & School attribution */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-3 py-1 rounded-lg bg-[var(--color-primary)] text-white font-serif font-black tracking-widest text-xs shadow-xs border border-black/10">
              ECU
            </div>
            <div>
              <p className="font-bold text-stone-900 dark:text-white text-sm tracking-tight leading-tight">
                ECU Performer Connect
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                School of Theatre and Dance • East Carolina University
              </p>
            </div>
          </div>

          {/* Figure 10 Label #7: Navigation & Report Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
            <button
              onClick={() => navigateTo('about')}
              className="hover:text-[var(--color-primary)] transition"
            >
              About Us
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="hover:text-[var(--color-primary)] transition"
            >
              Contact Us
            </button>
            <button
              onClick={() => navigateTo('report-user')}
              className="text-amber-700 dark:text-amber-400 hover:text-rose-600 flex items-center gap-1.5 transition font-semibold"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report User</span>
            </button>
            <button
              onClick={() => navigateTo('terms')}
              className="hover:text-[var(--color-primary)] transition"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
          <p>© {new Date().getFullYear()} East Carolina University. Restricted to verified campus accounts.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <span>Messick Theatre Arts Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
