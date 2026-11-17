export type RoleType = 'Performer' | 'Director';
export type UserClassification = 'Student' | 'Faculty';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export type LanguageProficiency =
  | 'Native / Fluent'
  | 'Conversational'
  | 'Practiced Performance Dialect';

export interface LanguageSkill {
  id: string;
  language: string;
  proficiency: LanguageProficiency;
}

export interface Characteristics {
  id: string;
  performer_id: string;
  height: string;
  gender: string;
  ethnicity: string;
  hair_color: string;
  eye_color: string;
  has_piercings: 'Yes' | 'No';
  has_tattoos: 'Yes' | 'No';
  partial_nudity: 'Yes' | 'No';
  full_nudity: 'Yes' | 'No';
  languages: LanguageSkill[];
}

export interface TheatreCredit {
  id: string;
  title: string;
  role: string;
  venue: string;
  director: string;
  year: string;
}

export interface FilmCredit {
  id: string;
  title: string;
  role: string;
  production: string;
  director: string;
  year: string;
}

export interface TrainingCredit {
  id: string;
  degree: string;
  institution: string;
  notes: string;
}

export interface ResumeData {
  id: string;
  user_id: string;
  roleType: RoleType;
  theatreCredits: TheatreCredit[];
  filmCredits: FilmCredit[];
  training: TrainingCredit[];
  awards: string[];
  specialSkillsSummary: string;
  fileUrl?: string;
  uploadedFileName?: string;
}

export interface MediaItem {
  id: string;
  user_id: string;
  type: 'video' | 'audio' | 'photo';
  title: string;
  file_path: string;
  thumbnail_path?: string;
  durationSeconds?: number; // max 180s (3 min) for videos
  uploadDate: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  classification: UserClassification;
  roles: RoleType[];
  isAdmin: boolean;
  headshot: string;
  location: string;
  sites: string[];
  about: string;
  availability: 'Available' | 'Busy with another project';
  isPrivate: boolean;
  enrolledDate: string;
  graduationDate?: string;
  status: UserStatus;
  lastActive: string;
  characteristics?: Characteristics;
  specialSkills: string[];
}

export interface WorkflowStage {
  id: string;
  stageName: 'Application' | 'Callback' | 'Final Audition' | string;
  instructions: string;
  order: number;
}

export interface CharacterRole {
  id: string;
  name: string;
  synopsis: string;
  roleType: 'Lead' | 'Supporting Character' | 'Other';
  workflowStages: WorkflowStage[];
}

export interface CastingCall {
  id: string;
  director_id: string;
  directorName: string;
  directorHeadshot?: string;
  title: string;
  productionType: 'Play' | 'Musical' | 'Film' | 'Student Film' | 'Other';
  producer: string;
  writer: string;
  castingDirector: string;
  shootDays: string;
  rateOfPay: string;
  location: 'Greenville/ECU' | 'Other NC' | 'Remote/Online' | 'Other' | string;
  deadline: string;
  specialSkills: string[];
  storyline: string;
  status: 'Draft' | 'Open' | 'Closed';
  postedDate: string;
  characters: CharacterRole[];
}

export interface Application {
  id: string;
  casting_call_id: string;
  castingCallTitle: string;
  character_id: string;
  characterName: string;
  performer_id: string;
  performerName: string;
  performerHeadshot: string;
  submissionDate: string;
  status: 'Submitted' | 'In Review' | 'Callback' | 'Final Audition' | 'Accepted' | 'Rejected' | 'Withdrawn';
  currentWorkflowStage: string;
  decision: 'Advance' | 'Hold' | 'Offer Role' | 'Decline' | 'Pending';
  auditionNotes: string;
  auditionVideoUrl?: string;
  actionRequired?: {
    message: string;
    stage: string;
    deadline: string;
    actionType: 'upload_video' | 'accept_offer' | 'schedule_time';
  };
}

export interface DirectMessage {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  otherUser: User;
  lastMessage: DirectMessage;
  unreadCount: number;
}

export interface FavoriteGroup {
  id: string;
  userId: string;
  name: string;
  memberUserIds: string[];
  image: string;
  createdDate: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'User/Profile' | 'Casting Call' | 'Message' | 'Other Content';
  targetEntityName: string;
  reason: 'Harassment/Bullying' | 'Inappropriate Content' | 'Spam' | 'Impersonation' | 'Discrimination' | 'Other';
  description: string;
  attachmentName?: string;
  date: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Dismissed';
  adminAction?: 'No Action / Dismiss' | 'Request More Information' | 'Warn User' | 'Restrict Account' | 'Escalate';
  adminNotes?: string;
}

export type ColorTheme = 'ecu' | 'coastal' | 'emerald' | 'crimson';
export type DisplayMode = 'system' | 'light' | 'dark';

export interface UserSettings {
  colorTheme: ColorTheme;
  displayMode: DisplayMode;
  messageNotifications: boolean;
  emailNotifications: boolean;
  isPrivate: boolean;
}
