'use client';

import React from 'react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Platform } from '@/config/platforms';
import { platformApi } from '@/data/platform';

interface PlatformConnectorProps {
  platform: Platform;
  title: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  username?: string;
  onDisconnect?: () => void;
}

export function PlatformConnector({
  platform,
  title,
  description,
  icon,
  isConnected,
  username,
  onDisconnect,
}: PlatformConnectorProps) {
  const [loading, setLoading] = React.useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const url = await platformApi.getOAuthUrl(platform);
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting to platform:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await platformApi.disconnect(platform);
      onDisconnect?.();
    } catch (error) {
      console.error('Error disconnecting platform:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            {username && (
              <p className="text-sm text-gray-500 mt-1">
                Connected as @{username}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={isConnected ? handleDisconnect : handleConnect}
          variant={isConnected ? 'destructive' : 'default'}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <span className="loading loading-spinner" />
          ) : isConnected ? (
            'Disconnect'
          ) : (
            'Connect'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
