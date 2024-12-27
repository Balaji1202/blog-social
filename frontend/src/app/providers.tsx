'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
