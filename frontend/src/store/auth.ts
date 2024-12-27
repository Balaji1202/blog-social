import { create } from 'zustand';
import api from '@/lib/api';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  initialize: () => {
    const token = Cookies.get('token');
    const userStr = Cookies.get('user');
    const user = userStr ? JSON.parse(userStr) : null;

    set({
      token,
      user,
      isAuthenticated: !!token && !!user,
    });
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      // Store in cookies with secure settings
      Cookies.set('token', token, {
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
      Cookies.set('user', JSON.stringify(user), {
        secure: true,
        sameSite: 'strict',
        path: '/',
      });

      set({ token, user, isAuthenticated: true });
    } catch (error) {
      Cookies.remove('token');
      Cookies.remove('user');
      set({ token: null, user: null, isAuthenticated: false });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
