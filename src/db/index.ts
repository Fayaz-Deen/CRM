import Dexie, { type EntityTable } from 'dexie';
import type { Contact, Meeting, Reminder, MessageTemplate, User } from '../types';

interface LocalUser extends User {
  id: string;
}

interface SyncQueue {
  id?: number;
  type: 'create' | 'update' | 'delete';
  entity: 'contact' | 'meeting' | 'reminder' | 'template';
  entityId: string;
  data: Record<string, unknown>;
  createdAt: Date;
}

const db = new Dexie('PersonalCRM') as Dexie & {
  users: EntityTable<LocalUser, 'id'>;
  contacts: EntityTable<Contact, 'id'>;
  meetings: EntityTable<Meeting, 'id'>;
  reminders: EntityTable<Reminder, 'id'>;
  templates: EntityTable<MessageTemplate, 'id'>;
  syncQueue: EntityTable<SyncQueue, 'id'>;
};

db.version(1).stores({
  users: 'id, email',
  contacts: 'id, userId, name, company, *tags, lastContactedAt',
  meetings: 'id, contactId, userId, meetingDate, followupDate',
  reminders: 'id, userId, contactId, type, scheduledAt, status',
  templates: 'id, userId, type',
  syncQueue: '++id, type, entity, entityId, createdAt'
});

export { db };
export type { SyncQueue };
