import { create } from 'zustand';
import { api } from '@/lib/api';
import { useChatStore } from '@/store/chat.store';

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isLoggingOut: boolean;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isLoggingOut: false,

  fetchProfile: async () => {
    set({ isLoading: true, error: null, isLoggingOut: false });
    try {
      const response = await api.get('/api/auth/me');
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.response?.data?.message || 'Failed to authenticate',
      });
    }
  },

  logout: () => {
    set({ isLoggingOut: true });
    if (typeof window !== 'undefined') {
      document.cookie =
        'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
      document.cookie =
        'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
    }
    // Clear chat store on logout
    useChatStore.getState().clearStore();
    set({ user: null, isAuthenticated: false });
  },
}));
