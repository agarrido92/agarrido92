import React from 'react';
import { Users, Clapperboard, Sparkles } from 'lucide-react';
import filmMakingImage from '../assets/images/ecu_film_making_1793810479939.jpg';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 animate-in fade-in">
      {/* Figure 11 Section 1: Page Title & Introduction */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-subtle)] px-3.5 py-1 rounded-full border border-[var(--color-primary-border)] inline-block">
          East Carolina University
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          About Us
        </h1>
        <p className="text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed pt-1">
          ECU Performer Connect was initiated by Professor Austin Jones and the School of Theatre and Dance to create a unified, professional casting and networking platform for student filmmakers, directors, and performers.
        </p>
      </div>

      {/* Dividing line as laid out in the Figure 11 wireframe */}
      <hr className="border-t border-[#E5E5E0] dark:border-stone-700" />

      {/* Figure 11 Section 2: Our Purpose (Separated section with filmmaking image) */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 text-center">
            Our Purpose
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 text-center">
            Bridging cinematic storytelling and performance talent across East Carolina University
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Authentic ECU Filmmaking Production Image */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E5E5E0] dark:border-stone-700 bg-stone-100 dark:bg-stone-800 aspect-[16/10] relative group">
            <img
              src={filmMakingImage}
              alt="ECU Student Filmmaking Set with Camera Operator, Director, and Actors"
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-stone-800 shadow-xs backdrop-blur-xs border border-stone-200/80">
                <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
                <span>Student Film Production • ECU Campus</span>
              </span>
            </div>
          </div>

          {/* Short explanation of purpose */}
          <div className="space-y-4 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            <p>
              Historically, student filmmakers, directors, and actors relied on fragmented Canvas discussion boards, social media groups, and word-of-mouth casting calls that lacked verification, standardized physical characteristics, or reliable reel hosting.
            </p>
            <p>
              <strong>ECU Performer Connect</strong> modernizes the audition and filmmaking lifecycle: from publishing verified casting notices and managing multi-stage callback workflows, to hosting headshots, 3-minute video reels, vocal auditions, and professional resumes.
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 italic pt-1">
              Fostering equitable, professional, and creative collaboration for student short films, independent cinema, and theatrical productions.
            </p>
          </div>
        </div>
      </div>

      {/* Dividing line as laid out in the Figure 11 wireframe */}
      <hr className="border-t border-[#E5E5E0] dark:border-stone-700" />

      {/* Figure 11 Section 3: Who It's For (Purely informative sections, NOT buttons) */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 text-center">
            Who It’s For
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 text-center">
            Designed for the diverse creative community within ECU’s School of Theatre and Dance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informative Card: Performers */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 shadow-xs text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
              Performers
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
              Showcase experience, resumes, and media reels. Network with fellow artists and student directors. Discover upcoming casting calls and auditions across student films, short cinematic pieces, and mainstage productions.
            </p>
          </div>

          {/* Informative Card: Directors & Filmmakers */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-800 border border-[#E5E5E0] dark:border-stone-700 shadow-xs text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] flex items-center justify-center mb-4">
              <Clapperboard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
              Directors &amp; Filmmakers
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
              Discover talent and showcase film projects. Publish casting calls, review candidate audition reels and headshots, filter by specific actor physical characteristics and skills, and organize auditions from submission through callbacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
