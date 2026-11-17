import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialUsers,
  initialCastingCalls,
  initialApplications,
  initialResumes,
  initialMedia,
  initialFavoriteGroups,
  initialMessages,
  initialReports
} from './src/data/seedData.ts';
import { User, CastingCall, Application, ReportItem, DirectMessage, FavoriteGroup, ResumeData, MediaItem } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store for server session
let users: User[] = [...initialUsers];
let castingCalls: CastingCall[] = [...initialCastingCalls];
let applications: Application[] = [...initialApplications];
let resumes: Record<string, ResumeData[]> = { ...initialResumes };
let media: Record<string, MediaItem[]> = { ...initialMedia };
let favoriteGroups: FavoriteGroup[] = [...initialFavoriteGroups];
let messages: DirectMessage[] = [...initialMessages];
let reports: ReportItem[] = [...initialReports];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- API Routes ---

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'ECU Performer Connect', timestamp: new Date().toISOString() });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // Verify ECU email domain
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@ecu.edu') && !cleanEmail.endsWith('@students.ecu.edu')) {
      return res.status(400).json({ error: 'Access restricted: Only official @ecu.edu or @students.ecu.edu accounts are permitted.' });
    }

    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this ECU email address.' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ error: 'This account has been suspended by an administrator.' });
    }

    // Two-factor authentication step requirement (FR-002)
    // Return requires2FA: true with a test passcode hint
    return res.json({
      requires2FA: true,
      userId: user.id,
      email: user.email,
      sampleCode: '252109', // Pirate passcode hint
      message: 'A 6-digit verification code has been sent to your ECU mailbox.'
    });
  });

  // Auth: Verify 2FA
  app.post('/api/auth/verify-2fa', (req: Request, res: Response) => {
    const { userId, code } = req.body;
    if (!code || code.trim().length !== 6) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit verification code.' });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.lastActive = 'Just now';
    return res.json({ success: true, user });
  });

  // Auth: Register (FR-001, FR-002: Faculty added manually by admin; public registration only for @students.ecu.edu)
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { firstName, lastName, email, password, confirmPassword, roles } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.endsWith('@ecu.edu')) {
      return res.status(403).json({
        error: 'Faculty accounts are added manually by the department administrator. Self-registration is restricted to students with an @students.ecu.edu email address.'
      });
    }

    if (!cleanEmail.endsWith('@students.ecu.edu')) {
      return res.status(400).json({ error: 'Registration restricted (Figure 15): Only @students.ecu.edu email addresses are allowed.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return res.status(409).json({ error: 'An account with this ECU email already exists.' });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: cleanEmail,
      classification: 'Student', // Self-registered accounts are always students
      roles: roles && roles.length > 0 ? roles : ['Performer'],
      isAdmin: false,
      headshot: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      location: 'Greenville, NC (ECU Campus)',
      sites: [],
      about: 'Student performer/creator at East Carolina University.',
      availability: 'Available',
      isPrivate: false,
      enrolledDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastActive: 'Just now',
      specialSkills: ['Acting'],
    };

    users.push(newUser);

    return res.status(201).json({
      success: true,
      requires2FA: true,
      userId: newUser.id,
      email: newUser.email,
      sampleCode: '252109',
      message: 'Account created. Please enter the 6-digit confirmation code.'
    });
  });

  // Users: List & Search
  app.get('/api/users', (req: Request, res: Response) => {
    const { search, role, availability, classification, adminOnly } = req.query;
    let filtered = [...users];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.about.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        u.specialSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (role && typeof role === 'string' && role !== 'All') {
      if (role === 'Both') {
        filtered = filtered.filter(u => u.roles.includes('Performer') && u.roles.includes('Director'));
      } else if (role === 'Performer' || role === 'Director') {
        filtered = filtered.filter(u => u.roles.includes(role as any));
      } else if (role === 'Neither/Unassigned') {
        filtered = filtered.filter(u => u.roles.length === 0);
      }
    }

    if (availability && typeof availability === 'string' && availability !== 'All') {
      filtered = filtered.filter(u => u.availability === availability);
    }

    if (classification && typeof classification === 'string' && classification !== 'All') {
      filtered = filtered.filter(u => u.classification === classification);
    }

    if (adminOnly === 'true') {
      filtered = filtered.filter(u => u.isAdmin);
    } else if (adminOnly === 'false') {
      filtered = filtered.filter(u => !u.isAdmin);
    }

    res.json(filtered);
  });

  // Users: Get by ID
  app.get('/api/users/:id', (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userResumes = resumes[user.id] || [];
    const userMedia = media[user.id] || [];
    res.json({ ...user, resumes: userResumes, media: userMedia });
  });

  // Users: Update profile / characteristics
  app.put('/api/users/:id', (req: Request, res: Response) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], ...req.body, id: users[userIndex].id };
    res.json(users[userIndex]);
  });

  // Admin: Toggle Admin / Suspend User
  app.patch('/api/admin/users/:id', (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.body.isAdmin !== undefined) user.isAdmin = Boolean(req.body.isAdmin);
    if (req.body.status !== undefined) user.status = req.body.status;
    if (req.body.classification !== undefined) user.classification = req.body.classification;

    res.json(user);
  });

  // Faculty: Add Faculty (Admin feature)
  app.post('/api/faculty', (req: Request, res: Response) => {
    const { firstName, lastName, email, isAdmin } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@ecu.edu')) {
      return res.status(400).json({ error: 'Faculty email must end with @ecu.edu' });
    }

    const newFaculty: User = {
      id: `faculty-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: cleanEmail,
      classification: 'Faculty',
      roles: ['Director'],
      isAdmin: Boolean(isAdmin),
      headshot: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      location: 'Greenville, NC • ECU Messick Theatre Arts Center',
      sites: ['https://theatre.ecu.edu/faculty'],
      about: 'Faculty member at ECU School of Theatre and Dance.',
      availability: 'Available',
      isPrivate: false,
      enrolledDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastActive: 'Just added',
      specialSkills: ['Directing', 'Curriculum', 'Coaching'],
    };

    users.push(newFaculty);
    res.status(201).json(newFaculty);
  });

  // Casting Calls: List with filters & sort
  app.get('/api/casting-calls', (req: Request, res: Response) => {
    const { search, productionType, roleType, location, sort, directorId } = req.query;
    let list = [...castingCalls];

    if (directorId && typeof directorId === 'string') {
      list = list.filter(c => c.director_id === directorId);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.storyline.toLowerCase().includes(q) ||
        c.characters.some(ch => ch.name.toLowerCase().includes(q) || ch.synopsis.toLowerCase().includes(q))
      );
    }

    if (productionType && productionType !== 'All production types' && productionType !== 'All') {
      list = list.filter(c => c.productionType === productionType);
    }

    if (roleType && roleType !== 'All' && roleType !== 'All roles') {
      list = list.filter(c => c.characters.some(ch => ch.roleType === roleType));
    }

    if (location && location !== 'All locations' && location !== 'All') {
      list = list.filter(c => c.location === location);
    }

    // Sort options: Newest first, Oldest first, Deadline soonest, Deadline latest
    if (sort === 'Newest first') {
      list.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    } else if (sort === 'Oldest first') {
      list.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
    } else if (sort === 'Deadline soonest') {
      list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sort === 'Deadline latest') {
      list.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    }

    res.json(list);
  });

  // Casting Calls: Get by ID
  app.get('/api/casting-calls/:id', (req: Request, res: Response) => {
    const cc = castingCalls.find(c => c.id === req.params.id);
    if (!cc) {
      return res.status(404).json({ error: 'Casting call not found' });
    }
    res.json(cc);
  });

  // Casting Calls: Create
  app.post('/api/casting-calls', (req: Request, res: Response) => {
    const data = req.body;
    if (!data.title || !data.productionType || !data.deadline) {
      return res.status(400).json({ error: 'Title, production type, and deadline are required.' });
    }

    const newCastingCall: CastingCall = {
      ...data,
      id: `cc-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      status: data.status || 'Open',
      characters: data.characters && data.characters.length > 0 ? data.characters : [
        {
          id: `char-${Date.now()}-1`,
          name: 'Lead Character',
          synopsis: 'Central role.',
          roleType: 'Lead',
          workflowStages: [
            { id: 's1', stageName: 'Application', instructions: 'Submit headshot and resume', order: 1 },
            { id: 's2', stageName: 'Callback', instructions: 'Sides reading', order: 2 },
            { id: 's3', stageName: 'Final Audition', instructions: 'Chemistry test', order: 3 },
          ]
        }
      ]
    };

    castingCalls.unshift(newCastingCall);
    res.status(201).json(newCastingCall);
  });

  // Applications: List
  app.get('/api/applications', (req: Request, res: Response) => {
    const { performerId, castingCallId, characterId, status } = req.query;
    let list = [...applications];

    if (performerId) list = list.filter(a => a.performer_id === performerId);
    if (castingCallId) list = list.filter(a => a.casting_call_id === castingCallId);
    if (characterId) list = list.filter(a => a.character_id === characterId);
    if (status && status !== 'All') list = list.filter(a => a.status === status);

    res.json(list);
  });

  // Applications: Submit
  app.post('/api/applications', (req: Request, res: Response) => {
    const { casting_call_id, character_id, performer_id, auditionNotes, auditionVideoUrl } = req.body;

    const cc = castingCalls.find(c => c.id === casting_call_id);
    const char = cc?.characters.find(ch => ch.id === character_id);
    const performer = users.find(u => u.id === performer_id);

    if (!cc || !char || !performer) {
      return res.status(400).json({ error: 'Invalid casting call, character, or performer.' });
    }

    // Check duplicate
    const exists = applications.find(a => a.casting_call_id === casting_call_id && a.character_id === character_id && a.performer_id === performer_id);
    if (exists) {
      return res.status(400).json({ error: 'You have already applied for this character role.' });
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      casting_call_id,
      castingCallTitle: cc.title,
      character_id,
      characterName: char.name,
      performer_id,
      performerName: performer.name,
      performerHeadshot: performer.headshot,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      currentWorkflowStage: 'Application',
      decision: 'Pending',
      auditionNotes: auditionNotes || '',
      auditionVideoUrl: auditionVideoUrl || '',
    };

    applications.unshift(newApp);
    res.status(201).json(newApp);
  });

  // Applications: Update Decision & Stage
  app.patch('/api/applications/:id', (req: Request, res: Response) => {
    const appItem = applications.find(a => a.id === req.params.id);
    if (!appItem) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { decision, currentWorkflowStage, status, actionRequired } = req.body;
    if (decision !== undefined) appItem.decision = decision;
    if (currentWorkflowStage !== undefined) appItem.currentWorkflowStage = currentWorkflowStage;
    if (status !== undefined) appItem.status = status;
    if (actionRequired !== undefined) appItem.actionRequired = actionRequired;

    res.json(appItem);
  });

  // Messages: Get Threads for User
  app.get('/api/messages/threads/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const userMessages = messages.filter(m => m.senderId === userId || m.receiverId === userId);

    const threadMap: Record<string, DirectMessage[]> = {};
    for (const msg of userMessages) {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!threadMap[otherId]) threadMap[otherId] = [];
      threadMap[otherId].push(msg);
    }

    const threads = Object.entries(threadMap).map(([otherId, msgs]) => {
      msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const lastMsg = msgs[msgs.length - 1];
      const otherUser = users.find(u => u.id === otherId) || {
        id: otherId,
        name: 'ECU User',
        headshot: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        email: 'user@ecu.edu',
        classification: 'Student',
        roles: ['Performer'],
        isAdmin: false,
        location: 'Greenville, NC',
        sites: [],
        about: '',
        availability: 'Available',
        isPrivate: false,
        enrolledDate: '2024-01-01',
        status: 'Active',
        lastActive: 'Recently',
        specialSkills: [],
        firstName: 'ECU',
        lastName: 'User'
      };

      const unreadCount = msgs.filter(m => m.receiverId === userId && !m.read).length;

      return {
        id: `thread-${otherId}`,
        otherUser,
        participantIds: [userId, otherId],
        lastMessage: lastMsg,
        unreadCount,
        allMessages: msgs,
      };
    });

    res.json(threads);
  });

  // Messages: Send
  app.post('/api/messages', (req: Request, res: Response) => {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ error: 'senderId, receiverId, and content are required' });
    }

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      threadId: `th-${[senderId, receiverId].sort().join('-')}`,
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
    };

    messages.push(newMsg);
    res.status(201).json(newMsg);
  });

  // Favorites: Groups
  app.get('/api/favorites/:userId', (req: Request, res: Response) => {
    const userGroups = favoriteGroups.filter(g => g.userId === req.params.userId);
    res.json(userGroups);
  });

  app.post('/api/favorites/groups', (req: Request, res: Response) => {
    const { userId, name, image } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ error: 'userId and group name are required' });
    }

    const newGroup: FavoriteGroup = {
      id: `grp-${Date.now()}`,
      userId,
      name,
      memberUserIds: [],
      image: image || 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=300&q=80',
      createdDate: new Date().toISOString().split('T')[0],
    };

    favoriteGroups.unshift(newGroup);
    res.status(201).json(newGroup);
  });

  app.patch('/api/favorites/groups/:id', (req: Request, res: Response) => {
    const grp = favoriteGroups.find(g => g.id === req.params.id);
    if (!grp) return res.status(404).json({ error: 'Group not found' });
    if (req.body.name) grp.name = req.body.name;
    if (req.body.memberUserIds) grp.memberUserIds = req.body.memberUserIds;
    res.json(grp);
  });

  app.delete('/api/favorites/groups/:id', (req: Request, res: Response) => {
    const idx = favoriteGroups.findIndex(g => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Group not found' });
    favoriteGroups.splice(idx, 1);
    res.json({ success: true });
  });

  // Reports
  app.get('/api/reports', (req: Request, res: Response) => {
    const { status, type, search } = req.query;
    let list = [...reports];

    if (status && status !== 'All') list = list.filter(r => r.status === status);
    if (type && type !== 'All') list = list.filter(r => r.targetType === type);
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.targetEntityName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  app.post('/api/reports', (req: Request, res: Response) => {
    const { reporterId, targetType, targetEntityName, reason, description, attachmentName } = req.body;
    const reporter = users.find(u => u.id === reporterId);

    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporterId: reporterId || 'guest',
      reporterName: reporter ? reporter.name : 'Anonymous ECU User',
      targetType: targetType || 'User/Profile',
      targetEntityName: targetEntityName || 'Unspecified user or post',
      reason: reason || 'Inappropriate Content',
      description: description || '',
      attachmentName: attachmentName || undefined,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Open',
    };

    reports.unshift(newReport);
    res.status(201).json(newReport);
  });

  app.patch('/api/reports/:id', (req: Request, res: Response) => {
    const rep = reports.find(r => r.id === req.params.id);
    if (!rep) return res.status(404).json({ error: 'Report not found' });
    if (req.body.status) rep.status = req.body.status;
    if (req.body.adminAction) rep.adminAction = req.body.adminAction;
    if (req.body.adminNotes !== undefined) rep.adminNotes = req.body.adminNotes;
    res.json(rep);
  });

  // Resumes & Media
  app.get('/api/resumes/:userId', (req: Request, res: Response) => {
    res.json(resumes[req.params.userId] || []);
  });

  app.post('/api/resumes/:userId', (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!resumes[userId]) resumes[userId] = [];
    const newResume: ResumeData = {
      id: `res-${Date.now()}`,
      user_id: userId,
      ...req.body
    };
    resumes[userId].push(newResume);
    res.status(201).json(newResume);
  });

  app.get('/api/media/:userId', (req: Request, res: Response) => {
    res.json(media[req.params.userId] || []);
  });

  app.post('/api/media/:userId', (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!media[userId]) media[userId] = [];
    const { type, title, file_path, durationSeconds } = req.body;

    // FR-003: Video up to 3 minutes validation
    if (type === 'video' && durationSeconds && durationSeconds > 180) {
      return res.status(400).json({ error: 'Video duration exceeds maximum allowed limit of 3 minutes (180 seconds).' });
    }

    const newMedia: MediaItem = {
      id: `med-${Date.now()}`,
      user_id: userId,
      type: type || 'photo',
      title: title || 'Uploaded Media',
      file_path: file_path || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      durationSeconds: durationSeconds || (type === 'video' ? 90 : undefined),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    media[userId].push(newMedia);
    res.status(201).json(newMedia);
  });

  // --- Vite Dev Server or Production Static Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ECU Performer Connect server listening on port ${PORT}`);
  });
}

startServer();
