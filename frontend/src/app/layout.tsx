'use client';

import { Inter } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import StyledComponentsRegistry from '@/lib/registry';
import { ToastProvider } from '@/components/ui/toast';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Blog Social - Automate Your Social Media Content</title>
        <meta
          name="description"
          content="Automatically create and share social media content from your blog posts"
        />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <StyledComponentsRegistry>
            <ToastProvider>
              <Providers>{children}</Providers>
            </ToastProvider>
          </StyledComponentsRegistry>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
