'use client';

import { FiFileText, FiShare2, FiLink } from 'react-icons/fi';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import StatsGrid from '@/components/dashboard/StatsGrid';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Title } from '@/components/common/Typography';
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
