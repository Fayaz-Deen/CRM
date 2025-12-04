export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  timezone: string;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  birthdayReminderDays: number;
  anniversaryReminderDays: number;
  defaultFollowupDays: number;
  theme: 'light' | 'dark' | 'system';
  notificationPrefs: {
    push: boolean;
    email: boolean;
  };
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  emails: string[];
  phones: string[];
  whatsappNumber?: string;
  instagramHandle?: string;
  company?: string;
  tags: string[];
  address?: string;
  notes?: string;
  birthday?: string;
  anniversary?: string;
  profilePicture?: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type MeetingMedium =
  | 'phone_call'
  | 'whatsapp'
  | 'email'
  | 'sms'
  | 'in_person'
  | 'video_call'
  | 'instagram_dm'
  | 'other';

export interface Meeting {
  id: string;
  contactId: string;
  userId: string;
  meetingDate: string;
  medium: MeetingMedium;
  notes?: string;
  outcome?: string;
  followupDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReminderType = 'birthday' | 'anniversary' | 'followup' | 'no_contact';
export type ReminderStatus = 'pending' | 'sent' | 'dismissed';

export interface Reminder {
  id: string;
  userId: string;
  contactId: string;
  type: ReminderType;
  scheduledAt: string;
  sentAt?: string;
  status: ReminderStatus;
  createdAt: string;
}

export interface Share {
  id: string;
  contactId: string;
  ownerUserId: string;
  sharedWithUserId: string;
  permission: 'view' | 'view_add';
  expiresAt?: string;
  note?: string;
  createdAt: string;
}

export interface ShareResponse {
  id: string;
  contactId: string;
  contactName: string;
  ownerUserId: string;
  ownerName: string;
  ownerEmail: string;
  sharedWithUserId: string;
  sharedWithName: string;
  sharedWithEmail: string;
  permission: string;
  expiresAt?: string;
  note?: string;
  createdAt: string;
}

export interface MessageTemplate {
  id: string;
  userId: string;
  name: string;
  type: 'followup' | 'birthday' | 'anniversary' | 'custom';
  content: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}
