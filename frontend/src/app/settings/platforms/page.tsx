import React from 'react';
import { Metadata } from 'next';
import { PlatformsList } from './platforms-list';

export const metadata: Metadata = {
  title: 'Platform Settings',
  description: 'Connect and manage your blog and social media platforms',
};

export default function PlatformSettings() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Platform Settings</h1>
      <PlatformsList />
    </div>
  );
}
