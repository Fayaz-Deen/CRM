import { create } from 'zustand';
import type { MessageTemplate } from '../types';
import api from '../services/api';

interface TemplateState {
  templates: MessageTemplate[];
  isLoading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: (name: string, type: string, content: string) => Promise<MessageTemplate>;
  updateTemplate: (id: string, name: string, type: string, content: string) => Promise<MessageTemplate>;
  deleteTemplate: (id: string) => Promise<void>;
  getTemplatesByType: (type: string) => MessageTemplate[];
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<MessageTemplate[]>('/templates');
      set({ templates: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch templates', isLoading: false });
    }
  },

  createTemplate: async (name, type, content) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post<MessageTemplate>('/templates', { name, type, content });
      set((state) => ({
        templates: [...state.templates, data],
        isLoading: false,
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create template', isLoading: false });
      throw error;
    }
  },

  updateTemplate: async (id, name, type, content) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.put<MessageTemplate>(`/templates/${id}`, { name, type, content });
      set((state) => ({
        templates: state.templates.map((t) => (t.id === id ? data : t)),
        isLoading: false,
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to update template', isLoading: false });
      throw error;
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/templates/${id}`);
      set((state) => ({
        templates: state.templates.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete template', isLoading: false });
      throw error;
    }
  },

  getTemplatesByType: (type) => {
    return get().templates.filter((t) => t.type === type);
  },
}));
