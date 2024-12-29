import axios from 'axios';
import { Platform } from '@/config/platforms';

export interface PlatformConnection {
    platform: Platform;
    isConnected: boolean;
    lastSync?: string;
    platformUsername?: string;
}

export const platformApi = {
    getConnections: async (): Promise<PlatformConnection[]> => {
        const response = await axios.get('/api/connections');
        return response.data;
    },
    
    getOAuthUrl: async (platform: Platform): Promise<string> => {
        const response = await axios.get(`/api/oauth/${platform.toLowerCase()}/url`);
        return response.data.url;
    },
    
    disconnect: async (platform: Platform): Promise<void> => {
        await axios.post(`/api/oauth/${platform.toLowerCase()}/disconnect`);
    }
};
