import { create } from 'zustand';
import type { Contact } from '../types';
import { db } from '../db';
import { contactApi } from '../services/api';

interface ContactState {
  contacts: Contact[];
  selectedContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTags: string[];
  fetchContacts: () => Promise<void>;
  getContact: (id: string) => Promise<Contact | null>;
  createContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Contact>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
  setSelectedContact: (contact: Contact | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  selectedContact: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedTags: [],

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const contacts = await contactApi.getAll();
      await db.contacts.bulkPut(contacts);
      set({ contacts, isLoading: false });
    } catch (error) {
      const localContacts = await db.contacts.toArray();
      set({ contacts: localContacts, isLoading: false, error: 'Using offline data' });
    }
  },

  getContact: async (id: string) => {
    try {
      const contact = await contactApi.getById(id);
      await db.contacts.put(contact);
      set({ selectedContact: contact });
      return contact;
    } catch {
      const localContact = await db.contacts.get(id);
      if (localContact) {
        set({ selectedContact: localContact });
        return localContact;
      }
      return null;
    }
  },

  createContact: async (contactData) => {
    set({ isLoading: true });
    try {
      const contact = await contactApi.create(contactData);
      await db.contacts.put(contact);
      set((state) => ({
        contacts: [...state.contacts, contact],
        isLoading: false,
      }));
      return contact;
    } catch {
      const tempContact: Contact = {
        ...contactData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.contacts.put(tempContact);
      await db.syncQueue.add({
        type: 'create',
        entity: 'contact',
        entityId: tempContact.id,
        data: tempContact as unknown as Record<string, unknown>,
        createdAt: new Date(),
      });
      set((state) => ({
        contacts: [...state.contacts, tempContact],
        isLoading: false,
      }));
      return tempContact;
    }
  },

  updateContact: async (id, contactData) => {
    set({ isLoading: true });
    try {
      const contact = await contactApi.update(id, contactData);
      await db.contacts.put(contact);
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? contact : c)),
        selectedContact: state.selectedContact?.id === id ? contact : state.selectedContact,
        isLoading: false,
      }));
      return contact;
    } catch {
      const existing = get().contacts.find((c) => c.id === id);
      if (existing) {
        const updated = { ...existing, ...contactData, updatedAt: new Date().toISOString() };
        await db.contacts.put(updated);
        await db.syncQueue.add({
          type: 'update',
          entity: 'contact',
          entityId: id,
          data: contactData as unknown as Record<string, unknown>,
          createdAt: new Date(),
        });
        set((state) => ({
          contacts: state.contacts.map((c) => (c.id === id ? updated : c)),
          selectedContact: state.selectedContact?.id === id ? updated : state.selectedContact,
          isLoading: false,
        }));
        return updated;
      }
      throw new Error('Contact not found');
    }
  },

  deleteContact: async (id) => {
    set({ isLoading: true });
    try {
      await contactApi.delete(id);
      await db.contacts.delete(id);
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
        selectedContact: state.selectedContact?.id === id ? null : state.selectedContact,
        isLoading: false,
      }));
    } catch {
      await db.contacts.delete(id);
      await db.syncQueue.add({
        type: 'delete',
        entity: 'contact',
        entityId: id,
        data: {},
        createdAt: new Date(),
      });
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
        selectedContact: state.selectedContact?.id === id ? null : state.selectedContact,
        isLoading: false,
      }));
    }
  },

  setSelectedContact: (contact) => set({ selectedContact: contact }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
}));
