import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Clapperboard, ArrowRight, Sparkles } from 'lucide-react';
import heroImage from '../assets/images/ecu_theatre_hero_1793809925614.jpg';

export const HomePage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 animate-in fade-in">
      {/* Figure 10: Hero Container - The theatrical stage performance image is the FULL SIZE of the box */}
      <div className="rounded-3xl overflow-hidden border border-[#E5E5E0] dark:border-stone-700 shadow-sm relative w-full h-[380px] sm:h-[460px] md:h-[500px] group bg-stone-900">
        {/* Full-size theatrical production image accommodating the full container */}
        <img
          src={heroImage}
          alt="East Carolina University School of Theatre and Dance Stage Performance"
          className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
        />

        {/* Sophisticated gradient overlay ensuring text legibility while showcasing the stage scene */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 flex flex-col justify-end p-6 sm:p-10 text-white">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span>ECU School of Theatre &amp; Dance • Messick Theatre Arts</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
              Welcome to ECU Performer Connect
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl drop-shadow-xs">
              A collaborative web platform created for performers, directors, and filmmakers in the East Carolina University community. Discover audition opportunities, showcase talent resumes, and streamline the casting process.
            </p>
          </div>
        </div>
      </div>

      {/* Figure 10 Label #6: Side-by-Side People and Casting Call Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Button 1: People */}
        <button
          onClick={() => navigateTo('search')}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 hover:border-[var(--color-primary)] hover:shadow-md transition duration-200 text-left group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-[var(--color-primary)] transition-colors">
              People
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 italic">
              Discover performers, and directors
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-700 flex items-center justify-between text-xs">
            <span className="text-stone-400">Directory of ECU actors &amp; filmmakers</span>
            <span className="font-bold text-[var(--color-primary)] group-hover:underline">Explore People →</span>
          </div>
        </button>

        {/* Button 2: Casting Calls */}
        <button
          onClick={() => navigateTo('casting-calls')}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 hover:border-[var(--color-primary)] hover:shadow-md transition duration-200 text-left group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clapperboard className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-[var(--color-primary)] transition-colors">
              Casting Calls
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 italic">
              Find your next role! Browse casting calls
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-700 flex items-center justify-between text-xs">
            <span className="text-stone-400">Auditions for plays, musicals &amp; films</span>
            <span className="font-bold text-[var(--color-primary)] group-hover:underline">Browse Roles →</span>
          </div>
        </button>
      </div>
    </div>
  );
};
