import { create } from 'zustand';
import type { User } from '../../types/auth';
import { getMe } from '../../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string, refreshToken?: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  setToken: (token, refreshToken) => {
    localStorage.setItem('access_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      // The API interceptor will handle token refresh, if it fails completely, it throws here
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
