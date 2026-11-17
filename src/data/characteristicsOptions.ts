import { Characteristics, LanguageProficiency } from '../types';

export const GENDER_OPTIONS = [
  'Prefer not to say',
  'Woman',
  'Man',
  'Non-Binary',
  'Transgender Woman',
  'Transgender Man',
  'Genderfluid',
  'Other',
];

export const ETHNICITY_OPTIONS = [
  'Prefer not to say',
  'Asian / Pacific Islander',
  'Black / African American',
  'Hispanic / Latino',
  'Indigenous / Native American',
  'Middle Eastern / North African',
  'White / Caucasian',
  'Multiracial / Biracial',
  'Other',
];

export const HAIR_COLOR_OPTIONS = [
  'Prefer not to say',
  'Black',
  'Dark Brown',
  'Light Brown',
  'Blonde',
  'Strawberry Blonde',
  'Red / Auburn',
  'Gray / Silver',
  'White',
  'Bald / Shaved',
  'Dyed / Fantasy Color',
  'Other',
];

export const EYE_COLOR_OPTIONS = [
  'Prefer not to say',
  'Brown',
  'Dark Brown',
  'Hazel',
  'Blue',
  'Green',
  'Gray',
  'Amber',
  'Heterochromia',
];

export const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Mandarin',
  'Cantonese',
  'Japanese',
  'Korean',
  'Arabic',
  'American Sign Language (ASL)',
  'Portuguese',
  'Russian',
  'Hindi',
  'Other',
];

export const LANGUAGE_PROFICIENCY_OPTIONS: {
  value: LanguageProficiency;
  label: string;
}[] = [
  {
    value: 'Native / Fluent',
    label: 'Native / Fluent',
  },
  {
    value: 'Conversational',
    label: 'Conversational',
  },
  {
    value: 'Practiced Performance Dialect',
    label: 'Practiced Performance Dialect',
  },
];

export interface SkillCategory {
  id: string;
  number: number;
  title: string;
  skills: string[];
  subgroups?: {
    label: string;
    skills: string[];
  }[];
}

export const SPECIAL_SKILLS_CATEGORIES: SkillCategory[] = [
  {
    id: 'movement-dance',
    number: 1,
    title: 'Movement, Dance & Physical Performance',
    skills: [
      'Ballet',
      'Jazz',
      'Tap',
      'Modern / Contemporary Dance',
      'Hip-Hop',
      'Ballroom Dance',
      'Swing Dance',
      'Musical Theatre Dance',
      'Partnering',
      'Stage Combat',
      'Unarmed Stage Combat',
      'Rapier / Sword Fighting',
      'Fencing',
      'Tumbling',
      'Gymnastics',
      'Acrobatics',
      'Aerial Arts',
      'Parkour',
      'Martial Arts',
      'Boxing',
      'Wrestling',
      'Yoga',
      'Pilates',
      'Clowning',
      'Physical Comedy',
      'Mime',
      'Puppetry',
      'Viewpoints',
      'Laban Movement',
      'Contact Improvisation',
    ],
  },
  {
    id: 'vocal-musical',
    number: 2,
    title: 'Vocal & Musical Skills',
    skills: [
      'Singing (identify vocal range)',
      'Classical Voice',
      'Musical Theatre',
      'Jazz / Pop / Rock / Country Singing',
      'A Cappella',
      'Choral Singing',
      'Beatboxing',
      'Rapping',
      'Songwriting',
      'Sight Reading',
      'Music Theory',
      'Harmony',
      'Vocal Percussion',
      'Dialect Work',
      'Vocal Characterization',
      'Voiceover',
      'Animation Voiceover',
      'ADR / Looping',
      'Commercial Voiceover',
      'Impersonations',
      'Whistling',
      'Yodeling',
      'Opera',
    ],
    subgroups: [
      {
        label: 'Instruments',
        skills: [
          'Piano / Keyboard',
          'Guitar (Acoustic / Electric)',
          'Bass Guitar',
          'Drums / Percussion',
          'Violin',
          'Viola',
          'Cello',
          'Trumpet',
          'Trombone',
          'Saxophone',
          'Flute',
          'Clarinet',
          'Banjo',
          'Ukulele',
          'Harmonica',
          'Mandolin',
        ],
      },
    ],
  },
  {
    id: 'dialects-accents',
    number: 3,
    title: 'Dialects and Accents',
    skills: [
      'General American',
      'Southern American',
      'Appalachian',
      'New York',
      'Boston',
      'Mid-Atlantic',
      'California',
      'Chicago',
      'British RP',
      'Cockney',
      'Estuary English',
      'Irish',
      'Scottish',
      'Welsh',
      'Australian',
      'New Zealand',
      'French Accent',
      'German Accent',
      'Italian Accent',
      'Spanish Accent',
      'Russian Accent',
      'Eastern European Accent',
      'African Accents (specify region)',
      'International Phonetic Alphabet (IPA)',
    ],
  },
  {
    id: 'sports-athletics',
    number: 4,
    title: 'Sports & Athletics',
    skills: [
      'Basketball',
      'Baseball',
      'Softball',
      'Football',
      'Soccer',
      'Volleyball',
      'Tennis',
      'Pickleball',
      'Golf',
      'Swimming',
      'Diving',
      'Track & Field',
      'Cross Country',
      'Gymnastics',
      'Cheerleading',
      'Wrestling',
      'Boxing',
      'Fencing',
      'Lacrosse',
      'Rugby',
      'Ice Hockey',
      'Figure Skating',
      'Skateboarding',
      'Snowboarding',
      'Skiing',
      'Surfing',
      'Rock Climbing',
      'Horseback Riding',
      'Cycling',
      'Running',
      'Weightlifting',
      'Archery',
      'Bowling',
      'Fishing',
      'Hunting',
    ],
  },
  {
    id: 'screen-camera',
    number: 5,
    title: 'Screen, Camera & Technical Skills',
    skills: [
      'Green Screen',
      'Motion Capture',
      'Performance Capture',
      'Self-Taping',
      'Teleprompter',
      'Hosting / Presenting',
      'Interviewing',
      'Livestreaming',
      'Podcasting',
      'Video Editing',
      'Audio Editing',
      'Photography',
      'Cinematography',
      'Camera Operation',
      'Production Sound',
      'Adobe Premiere Pro',
      'Adobe Audition',
      'DaVinci Resolve',
      'Final Cut Pro',
    ],
  },
  {
    id: 'stagecraft-production',
    number: 6,
    title: 'Stagecraft & Production Skills',
    skills: [
      'Stage Management',
      'Assistant Stage Management',
      'Directing',
      'Choreography',
      'Fight Choreography',
      'Lighting Operation',
      'Sound Operation',
      'Projection / Video Operation',
      'Scenic Construction',
      'Carpentry',
      'Scenic Painting',
      'Props Construction',
      'Costume Construction',
      'Sewing',
      'Wig Styling',
      'Hair Styling',
      'Makeup Application',
      'Special Effects Makeup',
      'Prosthetics',
      'Mask Work',
      'Puppetry Construction',
      'Rigging',
      'Fly System Operation',
    ],
  },
  {
    id: 'practical-specialized',
    number: 7,
    title: 'Practical & Specialized Skills',
    skills: [
      'Driving (Manual / Automatic)',
      'Motorcycle Operation',
      "Commercial Driver's License",
      'Horseback Riding',
      'Boating / Sailing',
      'Scuba Diving',
      'CPR / First Aid Certification',
      'Lifeguard Certification',
      'Firearms Training (specify legitimate training)',
      'Archery',
      'Knife Skills / Culinary Skills',
      'Cooking',
      'Bartending',
      'Mixology',
      'Barista Skills',
      'Professional Baking',
      'Typing',
      'Computer Literacy',
      'Sign Language',
      'Chess',
      'Card Tricks',
      'Sleight of Hand',
      'Juggling',
      'Magic',
      'Ventriloquism',
      'Animal Handling',
      'Equestrian Skills',
      'Knitting',
      'Crocheting',
      'Sewing',
      'Woodworking',
      'Automotive Mechanics',
      'Welding',
      'Handyman Skills',
    ],
  },
  {
    id: 'improv-performance',
    number: 8,
    title: 'Improvisation & Performance Specialties',
    skills: [
      'Improv Games',
      "Commedia dell'Arte",
      'Shakespeare / Heightened Language',
      'Mask Performance',
      'Commedia Masks',
      'Character Physicalization',
      'Character Voices',
      'Puppetry',
      'Stand-Up Comedy',
      'Sketch Comedy',
      'Satire',
      'Clown',
      'Drag Performance',
      'Burlesque',
      'Historical Reenactment',
    ],
  },
];

export const VOCAL_RANGE_PRESETS = [
  'Soprano',
  'Mezzo-Soprano',
  'Alto / Contralto',
  'Countertenor',
  'Tenor',
  'Baritone',
  'Bass-Baritone',
  'Bass',
];

export function getAllCategorySkills(category: SkillCategory): string[] {
  const subgroupSkills = category.subgroups ? category.subgroups.flatMap(sg => sg.skills) : [];
  return [...category.skills, ...subgroupSkills];
}

export function findCategoryForSkill(skill: string): SkillCategory | undefined {
  const lower = skill.toLowerCase();
  return SPECIAL_SKILLS_CATEGORIES.find(cat => {
    const all = getAllCategorySkills(cat);
    return all.some(item => {
      const itemLower = item.toLowerCase();
      if (itemLower === lower) return true;
      // Also match specified variants like "Singing (Soprano)" -> "Singing (identify vocal range)"
      const base = itemLower.replace(/\s*\([^)]*\)/g, '').trim();
      return base.length > 3 && lower.startsWith(base + ' (');
    });
  });
}

export function parseHeightParts(height: string): { feet: string; inches: string } {
  if (!height) return { feet: '', inches: '' };
  const match = height.match(/(\d)\s*['’]?\s*(\d{1,2})?/);
  if (!match) return { feet: '', inches: '' };
  return {
    feet: match[1] || '',
    inches: match[2] || '',
  };
}

export function formatHeightMask(feet: string, inches: string): string {
  if (!feet && !inches) return '';
  const f = feet || '0';
  const i = inches || '0';
  return `${f}' ${i}"`;
}

export function normalizeCharacteristics(
  char?: Partial<Characteristics> & Record<string, any>,
  userId = ''
): Characteristics | undefined {
  if (!char) return undefined;
  return {
    id: char.id || `char-${userId}`,
    performer_id: char.performer_id || userId,
    height: char.height || '',
    gender: char.gender || 'Prefer not to say',
    ethnicity: char.ethnicity || 'Prefer not to say',
    hair_color: char.hair_color || 'Prefer not to say',
    eye_color: char.eye_color || 'Prefer not to say',
    has_piercings:
      char.has_piercings === 'Yes' || char.has_piercings === 'No'
        ? char.has_piercings
        : typeof char.body_modifications === 'string' &&
          char.body_modifications.toLowerCase().includes('pierc')
        ? 'Yes'
        : 'No',
    has_tattoos:
      char.has_tattoos === 'Yes' || char.has_tattoos === 'No'
        ? char.has_tattoos
        : typeof char.body_modifications === 'string' &&
          char.body_modifications.toLowerCase().includes('tattoo')
        ? 'Yes'
        : 'No',
    partial_nudity:
      char.partial_nudity === 'Yes' || char.partial_nudity === 'No'
        ? char.partial_nudity
        : 'No',
    full_nudity:
      char.full_nudity === 'Yes' || char.full_nudity === 'No'
        ? char.full_nudity
        : 'No',
    languages: Array.isArray(char.languages) ? char.languages : [],
  };
}
