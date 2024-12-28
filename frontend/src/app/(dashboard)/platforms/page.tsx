'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SocialPlatform, CMSPlatform } from '@/config/platforms';
import usePlatformConnections from '@/store/platformConnections';
import PlatformCard from '@/components/platforms/PlatformCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PlatformsPage() {
  const searchParams = useSearchParams();
  const { connections, loading, error, fetchConnections, completeOAuth } =
    usePlatformConnections();

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  // Handle OAuth callback
  useEffect(() => {
    const platform = searchParams.get('platform');
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (platform && code && state) {
      completeOAuth(platform as any, code, state).catch((error) =>
        console.error('OAuth completion error:', error)
      );
    }
  }, [searchParams, completeOAuth]);

  const getConnectionStatus = (platform: string) => {
    const connection = connections.find((conn) => conn.platform === platform);
    return {
      isConnected: !!connection?.connected,
      userName: connection?.platformUserName,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Platform Connections</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Social Media Platforms</h2>
          {Object.values(SocialPlatform).map((platform) => {
            const { isConnected, userName } = getConnectionStatus(platform);
            return (
              <PlatformCard
                key={platform}
                platform={platform}
                isConnected={isConnected}
                userName={userName}
              />
            );
          })}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">
            Content Management Systems
          </h2>
          {Object.values(CMSPlatform).map((platform) => {
            const { isConnected, userName } = getConnectionStatus(platform);
            return (
              <PlatformCard
                key={platform}
                platform={platform}
                isConnected={isConnected}
                userName={userName}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
