'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log('Home Page - Auth State:', { isAuthenticated });

    // Add a small delay to ensure auth state is initialized
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        console.log('Authenticated, redirecting to dashboard');
        router.replace('/dashboard');
      } else {
        console.log('Not authenticated, redirecting to login');
        router.replace('/auth/login');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
}
