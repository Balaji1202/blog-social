'use client';

import React from 'react';
import { PlatformConnector } from '@/components/platforms/platform-connector';
import { useQuery } from '@tanstack/react-query';
import { FaLinkedin, FaTwitter, FaMedium } from 'react-icons/fa';
import { SiWebflow } from 'react-icons/si';
import { CMSPlatform, SocialPlatform } from '@/config/platforms';
import { platformApi, PlatformConnection } from '@/data/platform';
import { Platform } from '@/types';

export function PlatformsList() {
  const { data: connections, refetch } = useQuery<PlatformConnection[]>({
    queryKey: ['platform-connections'],
    queryFn: () => platformApi.getConnections(),
  });

  const isConnected = (platform: Platform) => {
    return (
      connections?.some(
        (conn) => conn.platform === platform && conn.isConnected
      ) ?? false
    );
  };

  const getPlatformUsername = (platform: Platform) => {
    return connections?.find(
      (conn) => conn.platform === platform && conn.isConnected
    )?.platformUsername;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Blog Platforms</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PlatformConnector
            platform={CMSPlatform.MEDIUM}
            title="Medium"
            description="Connect your Medium account to automatically fetch blog posts"
            icon={<FaMedium className="w-6 h-6" />}
            isConnected={isConnected(CMSPlatform.MEDIUM)}
            username={getPlatformUsername(CMSPlatform.MEDIUM)}
            onDisconnect={refetch}
          />
          <PlatformConnector
            platform={CMSPlatform.WEBFLOW}
            title="Webflow"
            description="Connect your Webflow site to automatically fetch blog posts"
            icon={<SiWebflow className="w-6 h-6" />}
            isConnected={isConnected(CMSPlatform.WEBFLOW)}
            username={getPlatformUsername(CMSPlatform.WEBFLOW)}
            onDisconnect={refetch}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Social Media</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PlatformConnector
            platform={SocialPlatform.TWITTER}
            title="Twitter"
            description="Share your blog post summaries on Twitter"
            icon={<FaTwitter className="w-6 h-6" />}
            isConnected={isConnected(SocialPlatform.TWITTER)}
            username={getPlatformUsername(SocialPlatform.TWITTER)}
            onDisconnect={refetch}
          />
          <PlatformConnector
            platform={SocialPlatform.LINKEDIN}
            title="LinkedIn"
            description="Share your blog post summaries on LinkedIn"
            icon={<FaLinkedin className="w-6 h-6" />}
            isConnected={isConnected(SocialPlatform.LINKEDIN)}
            username={getPlatformUsername(SocialPlatform.LINKEDIN)}
            onDisconnect={refetch}
          />
        </div>
      </div>
    </div>
  );
}
