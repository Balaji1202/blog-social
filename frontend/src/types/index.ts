import { SocialPlatform, CMSPlatform, Platform } from '../config/platforms';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  platform: CMSPlatform;
  summary?: string;
  metadata: Record<string, any>;
}

export interface SocialPost {
  id: string;
  blogPostId: string;
  content: string;
  platform: SocialPlatform;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  publishedAt?: string;
  platformPostId?: string;
  metadata: Record<string, any>;
  blogPost: {
    title: string;
    url: string;
  };
}

export interface PlatformConnection {
  id: string;
  platform: Platform;
  connected: boolean;
  platformUserId?: string;
  platformUserName?: string;
  settings: Record<string, any>;
  status?: 'active' | 'inactive';
}

export interface DashboardStats {
  totalBlogPosts: number;
  totalSocialPosts: number;
  platformConnections: PlatformConnection[];
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
