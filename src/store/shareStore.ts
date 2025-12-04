import { create } from 'zustand';
import type { ShareResponse, Contact } from '../types';
import api from '../services/api';

interface ShareState {
  sharedByMe: ShareResponse[];
  sharedWithMe: ShareResponse[];
  isLoading: boolean;
  error: string | null;
  fetchSharedByMe: () => Promise<void>;
  fetchSharedWithMe: () => Promise<void>;
  shareContact: (contactId: string, email: string, permission: string, expiresAt?: string, note?: string) => Promise<void>;
  revokeShare: (shareId: string) => Promise<void>;
  updateShare: (shareId: string, permission: string, expiresAt?: string, note?: string) => Promise<void>;
  getSharedContact: (contactId: string) => Promise<Contact>;
}

export const useShareStore = create<ShareState>((set) => ({
  sharedByMe: [],
  sharedWithMe: [],
  isLoading: false,
  error: null,

  fetchSharedByMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<ShareResponse[]>('/shares/by-me');
      set({ sharedByMe: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch shares', isLoading: false });
    }
  },

  fetchSharedWithMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<ShareResponse[]>('/shares/with-me');
      set({ sharedWithMe: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch shared contacts', isLoading: false });
    }
  },

  shareContact: async (contactId, email, permission, expiresAt, note) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post<ShareResponse>('/shares', {
        contactId,
        sharedWithEmail: email,
        permission,
        expiresAt,
        note,
      });
      set((state) => ({
        sharedByMe: [...state.sharedByMe, data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to share contact', isLoading: false });
      throw error;
    }
  },

  revokeShare: async (shareId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/shares/${shareId}`);
      set((state) => ({
        sharedByMe: state.sharedByMe.filter((s) => s.id !== shareId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to revoke share', isLoading: false });
      throw error;
    }
  },

  updateShare: async (shareId, permission, expiresAt, note) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.put<ShareResponse>(`/shares/${shareId}`, {
        permission,
        expiresAt,
        note,
      });
      set((state) => ({
        sharedByMe: state.sharedByMe.map((s) => (s.id === shareId ? data : s)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update share', isLoading: false });
      throw error;
    }
  },

  getSharedContact: async (contactId) => {
    return await api.get<Contact>(`/shares/contact/${contactId}`);
  },
}));
