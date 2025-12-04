import type { AuthResponse, Contact, Meeting, User, Reminder } from '../types';
import { useAuthStore } from '../store/authStore';

const API_BASE = '/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = useAuthStore.getState().token;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return this.request(endpoint, options);
      }
      useAuthStore.getState().logout();
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        useAuthStore.getState().setAuth(data.user, data.token, data.refreshToken);
        return true;
      }
    } catch {
      // Refresh failed
    }
    return false;
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiClient();

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, name }),

  googleAuth: (code: string) =>
    api.post<AuthResponse>('/auth/google', { code }),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),

  getProfile: () => api.get<User>('/auth/profile'),

  updateProfile: (data: Partial<User>) =>
    api.put<User>('/auth/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword }),

  deleteAccount: () => api.delete<{ message: string }>('/auth/account'),
};

export const contactApi = {
  getAll: () => api.get<Contact[]>('/contacts'),

  getById: (id: string) => api.get<Contact>(`/contacts/${id}`),

  create: (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Contact>('/contacts', data),

  update: (id: string, data: Partial<Contact>) =>
    api.put<Contact>(`/contacts/${id}`, data),

  delete: (id: string) => api.delete<void>(`/contacts/${id}`),

  search: (query: string, tags?: string[]) =>
    api.get<Contact[]>(`/contacts/search?q=${encodeURIComponent(query)}${tags?.length ? `&tags=${tags.join(',')}` : ''}`),

  getSharedWithMe: () => api.get<Contact[]>('/contacts/shared'),

  shareContact: (contactId: string, email: string, permission: 'view' | 'view_add', expiresAt?: string) =>
    api.post<void>(`/contacts/${contactId}/share`, { email, permission, expiresAt }),

  revokeShare: (contactId: string, userId: string) =>
    api.delete<void>(`/contacts/${contactId}/share/${userId}`),
};

export const meetingApi = {
  getAll: () => api.get<Meeting[]>('/meetings'),

  getByContact: (contactId: string) =>
    api.get<Meeting[]>(`/meetings/contact/${contactId}`),

  getUpcomingFollowups: () =>
    api.get<Meeting[]>('/meetings/followups'),

  create: (data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Meeting>('/meetings', data),

  update: (id: string, data: Partial<Meeting>) =>
    api.put<Meeting>(`/meetings/${id}`, data),

  delete: (id: string) => api.delete<void>(`/meetings/${id}`),
};

export const reminderApi = {
  getAll: () => api.get<Reminder[]>('/reminders'),

  getPending: () => api.get<Reminder[]>('/reminders/pending'),

  dismiss: (id: string) =>
    api.put<Reminder>(`/reminders/${id}/dismiss`),
};

export const dashboardApi = {
  getStats: () =>
    api.get<{
      totalContacts: number;
      meetingsThisMonth: number;
      upcomingBirthdays: Contact[];
      upcomingAnniversaries: Contact[];
      pendingFollowups: Meeting[];
      recentlyContacted: Contact[];
      needsAttention: Contact[];
    }>('/dashboard/stats'),

  getMeetingsChart: () =>
    api.get<{ week: string; count: number }[]>('/dashboard/meetings-chart'),

  getMediumBreakdown: () =>
    api.get<{ medium: string; count: number }[]>('/dashboard/medium-breakdown'),

  getContactsOverTime: () =>
    api.get<{ month: string; count: number }[]>('/dashboard/contacts-over-time'),
};

export { api };
export default api;
