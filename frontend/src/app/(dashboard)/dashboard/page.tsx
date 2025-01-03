'use client';

import { FiFileText, FiShare2, FiLink } from 'react-icons/fi';
import DashboardLayout from '@/components/layout/dashboard-layout';
import StatsCard from '@/components/dashboard/stats-card';
import StatsGrid from '@/components/dashboard/stats-grid';
import LoadingSpinner from '@/components/common/loading-spinner';
import ErrorMessage from '@/components/common/error-message';
import { Title } from '@/components/common/typography';
import { useStats } from '@/data/hooks/useStats';

export default function DashboardPage() {
  const { stats, isLoading, isError, error } = useStats();

  return (
    <DashboardLayout>
      <Title>Dashboard</Title>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage
          message={
            error instanceof Error
              ? error.message
              : 'Failed to load dashboard stats'
          }
        />
      ) : (
        <StatsGrid>
          <StatsCard
            title="Blog Posts"
            value={stats?.totalBlogPosts || 0}
            icon={FiFileText}
            color="#3b82f6"
          />
          <StatsCard
            title="Social Posts"
            value={stats?.totalSocialPosts || 0}
            icon={FiShare2}
            color="#10b981"
          />
          <StatsCard
            title="Connected Platforms"
            value={stats?.platformConnections.length || 0}
            icon={FiLink}
            color="#8b5cf6"
          />
        </StatsGrid>
      )}
    </DashboardLayout>
  );
}
