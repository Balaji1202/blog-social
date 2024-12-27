import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { DashboardStats } from '@/types';

export const useStats = () => {
  const query = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.get('/api/stats');
      return response.data as DashboardStats;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    stats: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
