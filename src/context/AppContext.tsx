import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  CastingCall,
  Application,
  ResumeData,
  MediaItem,
  FavoriteGroup,
  DirectMessage,
  ReportItem,
  UserSettings,
  ColorTheme,
  DisplayMode,
  RoleType
} from '../types';
import {
  initialUsers,
  initialCastingCalls,
  initialApplications,
  initialResumes,
  initialMedia,
  initialFavoriteGroups,
  initialMessages,
  initialReports
} from '../data/seedData';
import { normalizeCharacteristics } from '../data/characteristicsOptions';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  castingCalls: CastingCall[];
  applications: Application[];
  resumes: Record<string, ResumeData[]>;
  media: Record<string, MediaItem[]>;
  favoriteGroups: FavoriteGroup[];
  messages: DirectMessage[];
  reports: ReportItem[];
  settings: UserSettings;
  activePage: string;
  pageParam: string | null;
  navigateTo: (page: string, param?: string) => void;
  login: (email: string) => Promise<{ requires2FA: boolean; sampleCode: string; error?: string }>;
  verify2FA: (code: string) => Promise<boolean>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles: RoleType[];
    classification?: 'Student' | 'Faculty';
  }) => Promise<{ requires2FA: boolean; sampleCode: string; error?: string }>;
  logout: () => void;
  switchUser: (userId: string | null) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  createCastingCall: (data: Partial<CastingCall>) => CastingCall;
  applyForRole: (castingCallId: string, characterId: string, notes: string, videoUrl?: string) => { success: boolean; error?: string };
  updateApplicationDecision: (
    applicationId: string,
    decision: 'Advance' | 'Hold' | 'Offer Role' | 'Decline' | 'Pending',
    currentStage?: string,
    status?: any,
    actionRequired?: any
  ) => void;
  sendMessage: (receiverId: string, content: string) => void;
  createFavoriteGroup: (name: string) => FavoriteGroup;
  renameFavoriteGroup: (groupId: string, newName: string) => void;
  deleteFavoriteGroup: (groupId: string) => void;
  toggleUserInFavoriteGroup: (targetUserId: string, groupId?: string) => void;
  isUserInFavorites: (targetUserId: string) => boolean;
  submitReport: (report: Omit<ReportItem, 'id' | 'date' | 'status' | 'reporterName'>) => void;
  updateReport: (reportId: string, update: Partial<ReportItem>) => void;
  addFaculty: (data: { firstName: string; lastName: string; email: string; isAdmin: boolean }) => void;
  updateUserStatus: (userId: string, update: Partial<User>) => void;
  addMediaItem: (userId: string, mediaItem: Omit<MediaItem, 'id' | 'uploadDate'>) => { success: boolean; error?: string };
  saveResume: (userId: string, resumeData: ResumeData) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ecu_users');
    if (!saved) return initialUsers;
    try {
      const parsed: User[] = JSON.parse(saved);
      return parsed.map(u => {
        const seedMatch = initialUsers.find(su => su.id === u.id);
        return {
          ...u,
          characteristics: u.characteristics
            ? normalizeCharacteristics(u.characteristics, u.id)
            : seedMatch?.characteristics,
        };
      });
    } catch {
      return initialUsers;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem('ecu_current_user_id');
    if (savedId === 'guest') return null;
    const found = users.find(u => u.id === (savedId || 'user-maya-lin'));
    return found || users[1]; // default Maya Lin (student performer)
  });

  const [castingCalls, setCastingCalls] = useState<CastingCall[]>(() => {
    const saved = localStorage.getItem('ecu_casting_calls');
    return saved ? JSON.parse(saved) : initialCastingCalls;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('ecu_applications');
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [resumes, setResumes] = useState<Record<string, ResumeData[]>>(() => {
    const saved = localStorage.getItem('ecu_resumes');
    return saved ? JSON.parse(saved) : initialResumes;
  });

  const [media, setMedia] = useState<Record<string, MediaItem[]>>(() => {
    const saved = localStorage.getItem('ecu_media');
    return saved ? JSON.parse(saved) : initialMedia;
  });

  const [favoriteGroups, setFavoriteGroups] = useState<FavoriteGroup[]>(() => {
    const saved = localStorage.getItem('ecu_favorite_groups');
    return saved ? JSON.parse(saved) : initialFavoriteGroups;
  });

  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('ecu_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('ecu_reports');
    return saved ? JSON.parse(saved) : initialReports;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('ecu_settings');
    return saved ? JSON.parse(saved) : {
      colorTheme: 'ecu',
      displayMode: 'light',
      messageNotifications: true,
      emailNotifications: true,
      isPrivate: false,
    };
  });

  const [activePage, setActivePage] = useState<string>('home');
  const [pageParam, setPageParam] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pending2FAUser, setPending2FAUser] = useState<User | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ecu_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ecu_casting_calls', JSON.stringify(castingCalls));
  }, [castingCalls]);

  useEffect(() => {
    localStorage.setItem('ecu_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('ecu_resumes', JSON.stringify(resumes));
  }, [resumes]);

  useEffect(() => {
    localStorage.setItem('ecu_media', JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem('ecu_favorite_groups', JSON.stringify(favoriteGroups));
  }, [favoriteGroups]);

  useEffect(() => {
    localStorage.setItem('ecu_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ecu_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('ecu_settings', JSON.stringify(settings));
    // Apply theme attribute to document
    document.documentElement.setAttribute('data-theme', settings.colorTheme);
    if (settings.displayMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecu_current_user_id', currentUser.id);
    } else {
      localStorage.setItem('ecu_current_user_id', 'guest');
    }
  }, [currentUser]);

  const navigateTo = (page: string, param?: string) => {
    setActivePage(page);
    setPageParam(param || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@ecu.edu') && !cleanEmail.endsWith('@students.ecu.edu')) {
      return { requires2FA: false, sampleCode: '', error: 'Access restricted: Only official @ecu.edu or @students.ecu.edu accounts are permitted.' };
    }

    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { requires2FA: false, sampleCode: '', error: 'No account found with this ECU email address. Please register.' };
    }

    if (user.status === 'Suspended') {
      return { requires2FA: false, sampleCode: '', error: 'This account has been suspended by an administrator.' };
    }

    setPending2FAUser(user);
    return {
      requires2FA: true,
      sampleCode: '252109',
    };
  };

  const verify2FA = async (code: string) => {
    if (code.trim() === '252109' || code.trim().length === 6) {
      if (pending2FAUser) {
        setCurrentUser(pending2FAUser);
        setPending2FAUser(null);
        return true;
      }
    }
    return false;
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles: RoleType[];
    classification?: 'Student' | 'Faculty';
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (cleanEmail.endsWith('@ecu.edu')) {
      return {
        requires2FA: false,
        sampleCode: '',
        error: 'Faculty accounts are added manually by the department administrator. Self-registration is restricted to students with an @students.ecu.edu email address.'
      };
    }
    if (!cleanEmail.endsWith('@students.ecu.edu')) {
      return { requires2FA: false, sampleCode: '', error: 'Registration restricted (Figure 15): Only @students.ecu.edu email addresses are allowed.' };
    }
    if (data.password !== data.confirmPassword) {
      return { requires2FA: false, sampleCode: '', error: 'Passwords do not match.' };
    }
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { requires2FA: false, sampleCode: '', error: 'An account with this ECU email already exists.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      email: cleanEmail,
      classification: 'Student', // Self-registered accounts are students
      roles: data.roles.length > 0 ? data.roles : ['Performer'],
      isAdmin: false,
      headshot: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      location: 'Greenville, NC • ECU Campus',
      sites: [],
      about: 'Student performer/creator at East Carolina University.',
      availability: 'Available',
      isPrivate: false,
      enrolledDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastActive: 'Just now',
      specialSkills: ['Acting'],
    };

    setUsers(prev => [...prev, newUser]);
    setPending2FAUser(newUser);

    return {
      requires2FA: true,
      sampleCode: '252109',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    navigateTo('home');
  };

  const switchUser = (userId: string | null) => {
    if (!userId) {
      setCurrentUser(null);
    } else {
      const u = users.find(x => x.id === userId);
      if (u) setCurrentUser(u);
    }
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateUserProfile = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...data } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, ...data } : null));
    }
  };

  const createCastingCall = (data: Partial<CastingCall>): CastingCall => {
    const newCC: CastingCall = {
      id: `cc-${Date.now()}`,
      director_id: currentUser ? currentUser.id : 'user-austin-jones',
      directorName: currentUser ? currentUser.name : 'Austin Jones',
      directorHeadshot: currentUser?.headshot,
      title: data.title || 'Untitled Production',
      productionType: data.productionType || 'Play',
      producer: data.producer || 'ECU School of Theatre & Dance',
      writer: data.writer || '',
      castingDirector: data.castingDirector || (currentUser ? currentUser.name : ''),
      shootDays: data.shootDays || 'TBA',
      rateOfPay: data.rateOfPay || 'Academic Credit',
      location: data.location || 'Greenville/ECU',
      deadline: data.deadline || '2026-12-31',
      specialSkills: data.specialSkills || ['Acting'],
      storyline: data.storyline || '',
      status: data.status || 'Open',
      postedDate: new Date().toISOString().split('T')[0],
      characters: data.characters && data.characters.length > 0 ? data.characters : [
        {
          id: `char-${Date.now()}`,
          name: 'Principal Role',
          synopsis: 'Lead character description.',
          roleType: 'Lead',
          workflowStages: [
            { id: 's1', stageName: 'Application', instructions: 'Submit headshot and resume', order: 1 },
            { id: 's2', stageName: 'Callback', instructions: 'Audition sides and reading', order: 2 },
            { id: 's3', stageName: 'Final Audition', instructions: 'Final director chemistry read', order: 3 },
          ]
        }
      ]
    };

    setCastingCalls(prev => [newCC, ...prev]);
    return newCC;
  };

  const applyForRole = (castingCallId: string, characterId: string, notes: string, videoUrl?: string) => {
    if (!currentUser) return { success: false, error: 'You must be logged in to apply for roles.' };
    const cc = castingCalls.find(c => c.id === castingCallId);
    const char = cc?.characters.find(ch => ch.id === characterId);
    if (!cc || !char) return { success: false, error: 'Casting call or character role not found.' };

    const alreadyApplied = applications.some(a => a.casting_call_id === castingCallId && a.character_id === characterId && a.performer_id === currentUser.id);
    if (alreadyApplied) return { success: false, error: 'You have already submitted an application for this role.' };

    const newApp: Application = {
      id: `app-${Date.now()}`,
      casting_call_id: castingCallId,
      castingCallTitle: cc.title,
      character_id: characterId,
      characterName: char.name,
      performer_id: currentUser.id,
      performerName: currentUser.name,
      performerHeadshot: currentUser.headshot,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      currentWorkflowStage: 'Application',
      decision: 'Pending',
      auditionNotes: notes,
      auditionVideoUrl: videoUrl,
    };

    setApplications(prev => [newApp, ...prev]);
    return { success: true };
  };

  const updateApplicationDecision = (
    applicationId: string,
    decision: 'Advance' | 'Hold' | 'Offer Role' | 'Decline' | 'Pending',
    currentStage?: string,
    status?: any,
    actionRequired?: any
  ) => {
    setApplications(prev =>
      prev.map(a => {
        if (a.id === applicationId) {
          let updatedStatus = status || a.status;
          if (decision === 'Advance') {
            updatedStatus = currentStage === 'Final Audition' ? 'Final Audition' : 'Callback';
          } else if (decision === 'Offer Role') {
            updatedStatus = 'Accepted';
          } else if (decision === 'Decline') {
            updatedStatus = 'Rejected';
          }
          return {
            ...a,
            decision,
            currentWorkflowStage: currentStage || a.currentWorkflowStage,
            status: updatedStatus,
            actionRequired: actionRequired !== undefined ? actionRequired : a.actionRequired,
          };
        }
        return a;
      })
    );
  };

  const sendMessage = (receiverId: string, content: string) => {
    if (!currentUser) return;
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      threadId: `th-${[currentUser.id, receiverId].sort().join('-')}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const createFavoriteGroup = (name: string): FavoriteGroup => {
    const newGrp: FavoriteGroup = {
      id: `grp-${Date.now()}`,
      userId: currentUser?.id || 'user-maya-lin',
      name,
      memberUserIds: [],
      image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=300&q=80',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setFavoriteGroups(prev => [newGrp, ...prev]);
    return newGrp;
  };

  const renameFavoriteGroup = (groupId: string, newName: string) => {
    setFavoriteGroups(prev => prev.map(g => (g.id === groupId ? { ...g, name: newName } : g)));
  };

  const deleteFavoriteGroup = (groupId: string) => {
    setFavoriteGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const toggleUserInFavoriteGroup = (targetUserId: string, groupId?: string) => {
    if (!currentUser) return;
    const userGroups = favoriteGroups.filter(g => g.userId === currentUser.id);
    let targetGroup = groupId ? userGroups.find(g => g.id === groupId) : userGroups[0];

    if (!targetGroup) {
      targetGroup = createFavoriteGroup('My Favorites');
    }

    setFavoriteGroups(prev =>
      prev.map(g => {
        if (g.id === targetGroup!.id) {
          const isMember = g.memberUserIds.includes(targetUserId);
          return {
            ...g,
            memberUserIds: isMember
              ? g.memberUserIds.filter(id => id !== targetUserId)
              : [...g.memberUserIds, targetUserId],
          };
        }
        return g;
      })
    );
  };

  const isUserInFavorites = (targetUserId: string) => {
    if (!currentUser) return false;
    return favoriteGroups.some(g => g.userId === currentUser.id && g.memberUserIds.includes(targetUserId));
  };

  const submitReport = (report: Omit<ReportItem, 'id' | 'date' | 'status' | 'reporterName'>) => {
    const newRep: ReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      reporterName: currentUser ? currentUser.name : 'Anonymous ECU User',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Open',
    };
    setReports(prev => [newRep, ...prev]);
  };

  const updateReport = (reportId: string, update: Partial<ReportItem>) => {
    setReports(prev => prev.map(r => (r.id === reportId ? { ...r, ...update } : r)));
  };

  const addFaculty = (data: { firstName: string; lastName: string; email: string; isAdmin: boolean }) => {
    const newFaculty: User = {
      id: `faculty-${Date.now()}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      email: data.email.trim().toLowerCase(),
      classification: 'Faculty',
      roles: ['Director'],
      isAdmin: data.isAdmin,
      headshot: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      location: 'Greenville, NC • ECU Messick Theatre Arts Center',
      sites: ['https://theatre.ecu.edu'],
      about: 'Faculty member in the ECU School of Theatre and Dance.',
      availability: 'Available',
      isPrivate: false,
      enrolledDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastActive: 'Just added',
      specialSkills: ['Directing', 'Curriculum', 'Coaching'],
    };
    setUsers(prev => [...prev, newFaculty]);
  };

  const updateUserStatus = (userId: string, update: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...update } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, ...update } : null));
    }
  };

  const addMediaItem = (userId: string, item: Omit<MediaItem, 'id' | 'uploadDate'>) => {
    // FR-003: Video up to 3 minutes validation
    if (item.type === 'video' && item.durationSeconds && item.durationSeconds > 180) {
      return { success: false, error: 'Video duration exceeds maximum allowed limit of 3 minutes (180 seconds).' };
    }

    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    setMedia(prev => ({
      ...prev,
      [userId]: [newItem, ...(prev[userId] || [])],
    }));

    return { success: true };
  };

  const saveResume = (userId: string, resumeData: ResumeData) => {
    setResumes(prev => {
      const userResumes = prev[userId] || [];
      const existingIdx = userResumes.findIndex(r => r.roleType === resumeData.roleType);
      if (existingIdx !== -1) {
        const updated = [...userResumes];
        updated[existingIdx] = resumeData;
        return { ...prev, [userId]: updated };
      } else {
        return { ...prev, [userId]: [...userResumes, resumeData] };
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        castingCalls,
        applications,
        resumes,
        media,
        favoriteGroups,
        messages,
        reports,
        settings,
        activePage,
        pageParam,
        navigateTo,
        login,
        verify2FA,
        register,
        logout,
        switchUser,
        updateSettings,
        updateUserProfile,
        createCastingCall,
        applyForRole,
        updateApplicationDecision,
        sendMessage,
        createFavoriteGroup,
        renameFavoriteGroup,
        deleteFavoriteGroup,
        toggleUserInFavoriteGroup,
        isUserInFavorites,
        submitReport,
        updateReport,
        addFaculty,
        updateUserStatus,
        addMediaItem,
        saveResume,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
