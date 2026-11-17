import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Figure 13 Heading & Label #1 Last Updated Date */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Terms & Conditions
        </h1>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Last Updated: October 26, 2026
        </p>
      </div>

      {/* Figure 13 Label #2 Terms and Conditions Text */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">1. Eligibility & University Affiliation (FR-001)</h2>
          <p>
            ECU Performer Connect is restricted exclusively to enrolled students and active faculty of East Carolina University. Verification of an official <code>@students.ecu.edu</code> or <code>@ecu.edu</code> email address is mandatory upon account registration and authentication.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">2. Account Activity & Retention Lifecycle (4.5 & 4.6)</h2>
          <p>
            In accordance with university data management standards:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Accounts that remain inactive for a continuous period of 6 months will automatically be placed into an <em>Inactive</em> status.</li>
            <li>Accounts with 12 months of inactivity, or 12 months post-graduation, are subject to automated data deletion and purging.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">3. Media Upload Guidelines & Storage Limits (FR-003)</h2>
          <p>
            Performers and directors may upload headshots, audio recordings, and demo reel videos. All uploaded videos are subject to an absolute maximum length of <strong>3 minutes (180 seconds)</strong>. Content must be directly relevant to theatrical, cinematic, musical, or vocal performance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">4. Code of Conduct & Audition Ethics (FR-009)</h2>
          <p>
            ECU is dedicated to an educational environment founded on respect, safety, and mutual support. Harassment, discrimination, unsolicited spam, impersonation, or unethical casting practices are strictly prohibited. The platform incorporates a direct reporting mechanism for administrator intervention and suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">5. Privacy & Profile Visibility</h2>
          <p>
            Performers may toggle their profile privacy at any time in Settings. Setting an account to Private conceals personal sizing and characteristics from general search directories while preserving existing direct application submissions.
          </p>
        </section>
      </div>
    </div>
  );
};
