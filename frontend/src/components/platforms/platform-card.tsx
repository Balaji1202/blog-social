import React from 'react';
import { Platform } from '@/types';
import { SocialPlatform, CMSPlatform, isSocialPlatform, isCMSPlatform } from '@/config/platforms';
import { FaTwitter, FaLinkedin, FaWordpress, FaMedium } from 'react-icons/fa';
import { SiWebflow } from 'react-icons/si';
import usePlatformConnections from '@/store/platformConnections';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlatformCardProps {
  platform: Platform;
  isConnected: boolean;
  userName?: string;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  isConnected,
  userName,
}) => {
  const { initiateOAuth, disconnectPlatform, connecting } = usePlatformConnections();

  const getPlatformIcon = () => {
    switch (platform) {
      case SocialPlatform.TWITTER:
        return FaTwitter;
      case SocialPlatform.LINKEDIN:
        return FaLinkedin;
      case CMSPlatform.WORDPRESS:
        return FaWordpress;
      case CMSPlatform.MEDIUM:
        return FaMedium;
      case CMSPlatform.WEBFLOW:
        return SiWebflow;
      default:
        return null;
    }
  };

  const getPlatformColor = () => {
    switch (platform) {
      case SocialPlatform.TWITTER:
        return 'text-blue-400';
      case SocialPlatform.LINKEDIN:
        return 'text-blue-600';
      case CMSPlatform.WORDPRESS:
        return 'text-blue-500';
      case CMSPlatform.MEDIUM:
        return 'text-gray-800';
      case CMSPlatform.WEBFLOW:
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPlatformDescription = () => {
    if (isSocialPlatform(platform)) {
      return 'Share your blog content automatically on this social media platform.';
    } else if (isCMSPlatform(platform)) {
      return 'Import and sync your blog posts from this content management system.';
    }
    return '';
  };

  const handleConnect = async () => {
    try {
      const authUrl = await initiateOAuth(platform);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate OAuth:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectPlatform(platform);
    } catch (error) {
      console.error('Failed to disconnect platform:', error);
    }
  };

  const Icon = getPlatformIcon();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center space-x-3">
          {Icon && <Icon className={`text-2xl ${getPlatformColor()}`} />}
          <div>
            <CardTitle className="text-lg">{platform}</CardTitle>
            {isConnected && userName && (
              <CardDescription>Connected as {userName}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{getPlatformDescription()}</p>
        {isConnected && (
          <Badge className="mt-2" variant="success">
            Connected
          </Badge>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button
            variant="destructive"
            onClick={handleDisconnect}
            className="w-full"
          >
            Disconnect
          </Button>
        ) : (
          <Button
            onClick={handleConnect}
            className="w-full"
            disabled={connecting[platform]}
          >
            {connecting[platform] ? 'Connecting...' : 'Connect'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlatformCard;
