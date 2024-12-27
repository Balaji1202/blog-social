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
  platform: string;
  summary?: string;
  metadata: Record<string, any>;
}

export interface SocialPost {
  id: string;
  blogPostId: string;
  content: string;
  platform: 'LINKEDIN' | 'TWITTER';
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
  platform:
    | 'WEBFLOW'
    | 'WORDPRESS'
    | 'MEDIUM'
    | 'LINKEDIN'
    | 'TWITTER'
    | 'twitter'
    | 'linkedin'
    | 'facebook';
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
