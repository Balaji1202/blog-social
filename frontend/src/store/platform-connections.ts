import { create } from 'zustand';
import api from '@/lib/api';
import { PlatformConnection, Platform } from '@/types';

interface PlatformConnectionsState {
  connections: PlatformConnection[];
  loading: boolean;
  error: string | null;
  connecting: { [key in Platform]?: boolean };
  fetchConnections: () => Promise<void>;
  initiateOAuth: (platform: Platform) => Promise<string>;
  completeOAuth: (platform: Platform, code: string, state: string) => Promise<void>;
  disconnectPlatform: (platform: Platform) => Promise<void>;
}

const usePlatformConnections = create<PlatformConnectionsState>((set, get) => ({
  connections: [],
  loading: false,
  error: null,
  connecting: {},

  fetchConnections: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/platform-connections');
      set({ connections: response.data });
    } catch (error) {
      set({ error: 'Failed to fetch platform connections' });
      console.error('Error fetching connections:', error);
    } finally {
      set({ loading: false });
    }
  },

  initiateOAuth: async (platform: Platform) => {
    try {
      set(state => ({
        connecting: { ...state.connecting, [platform]: true },
        error: null
      }));

      const response = await api.get(`/oauth/connect/${platform}`);
      return response.data.authUrl;
    } catch (error) {
      set({ error: `Failed to initiate ${platform} connection` });
      console.error('OAuth initiation error:', error);
      throw error;
    } finally {
      set(state => ({
        connecting: { ...state.connecting, [platform]: false }
      }));
    }
  },

  completeOAuth: async (platform: Platform, code: string, state: string) => {
    try {
      set({ error: null });
      await api.get(`/oauth/callback/${platform}?code=${code}&state=${state}`);
      await get().fetchConnections();
    } catch (error) {
      set({ error: `Failed to complete ${platform} connection` });
      console.error('OAuth completion error:', error);
      throw error;
    }
  },

  disconnectPlatform: async (platform: Platform) => {
    try {
      set({ error: null });
      await api.post(`/platform-connections/${platform}/disconnect`);
      await get().fetchConnections();
    } catch (error) {
      set({ error: `Failed to disconnect ${platform}` });
      console.error('Platform disconnection error:', error);
      throw error;
    }
  }
}));

export default usePlatformConnections;
