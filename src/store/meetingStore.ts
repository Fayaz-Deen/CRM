import { create } from 'zustand';
import type { Meeting } from '../types';
import { db } from '../db';
import { meetingApi } from '../services/api';

interface MeetingState {
  meetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  fetchMeetings: (contactId?: string) => Promise<void>;
  fetchUpcomingFollowups: () => Promise<Meeting[]>;
  createMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Meeting>;
  updateMeeting: (id: string, meeting: Partial<Meeting>) => Promise<Meeting>;
  deleteMeeting: (id: string) => Promise<void>;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetings: [],
  isLoading: false,
  error: null,

  fetchMeetings: async (contactId) => {
    set({ isLoading: true, error: null });
    try {
      const meetings = contactId
        ? await meetingApi.getByContact(contactId)
        : await meetingApi.getAll();
      if (contactId) {
        await db.meetings.bulkPut(meetings);
      }
      set({ meetings, isLoading: false });
    } catch {
      const query = contactId
        ? db.meetings.where('contactId').equals(contactId)
        : db.meetings;
      const localMeetings = await query.toArray();
      set({ meetings: localMeetings, isLoading: false, error: 'Using offline data' });
    }
  },

  fetchUpcomingFollowups: async () => {
    try {
      const followups = await meetingApi.getUpcomingFollowups();
      return followups;
    } catch {
      const today = new Date().toISOString().split('T')[0];
      const localFollowups = await db.meetings
        .where('followupDate')
        .aboveOrEqual(today)
        .toArray();
      return localFollowups;
    }
  },

  createMeeting: async (meetingData) => {
    set({ isLoading: true });
    try {
      const meeting = await meetingApi.create(meetingData);
      await db.meetings.put(meeting);
      set((state) => ({
        meetings: [...state.meetings, meeting],
        isLoading: false,
      }));
      return meeting;
    } catch {
      const tempMeeting: Meeting = {
        ...meetingData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.meetings.put(tempMeeting);
      await db.syncQueue.add({
        type: 'create',
        entity: 'meeting',
        entityId: tempMeeting.id,
        data: tempMeeting as unknown as Record<string, unknown>,
        createdAt: new Date(),
      });
      set((state) => ({
        meetings: [...state.meetings, tempMeeting],
        isLoading: false,
      }));
      return tempMeeting;
    }
  },

  updateMeeting: async (id, meetingData) => {
    set({ isLoading: true });
    try {
      const meeting = await meetingApi.update(id, meetingData);
      await db.meetings.put(meeting);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
        isLoading: false,
      }));
      return meeting;
    } catch {
      const existing = get().meetings.find((m) => m.id === id);
      if (existing) {
        const updated = { ...existing, ...meetingData, updatedAt: new Date().toISOString() };
        await db.meetings.put(updated);
        await db.syncQueue.add({
          type: 'update',
          entity: 'meeting',
          entityId: id,
          data: meetingData as unknown as Record<string, unknown>,
          createdAt: new Date(),
        });
        set((state) => ({
          meetings: state.meetings.map((m) => (m.id === id ? updated : m)),
          isLoading: false,
        }));
        return updated;
      }
      throw new Error('Meeting not found');
    }
  },

  deleteMeeting: async (id) => {
    set({ isLoading: true });
    try {
      await meetingApi.delete(id);
      await db.meetings.delete(id);
      set((state) => ({
        meetings: state.meetings.filter((m) => m.id !== id),
        isLoading: false,
      }));
    } catch {
      await db.meetings.delete(id);
      await db.syncQueue.add({
        type: 'delete',
        entity: 'meeting',
        entityId: id,
        data: {},
        createdAt: new Date(),
      });
      set((state) => ({
        meetings: state.meetings.filter((m) => m.id !== id),
        isLoading: false,
      }));
    }
  },
}));
