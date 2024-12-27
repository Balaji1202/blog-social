'use client';

import { useState, useEffect } from 'react';
import { PlatformConnection } from '@/types';
import api from '@/lib/api';

export default function SettingsPage() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [autoPost, setAutoPost] = useState(false);
  const [requireReview, setRequireReview] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await api.get('/connections');
        setConnections(response.data);
      } catch (error) {
        setError('Failed to fetch platform connections');
        console.error('Error fetching connections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleDisconnect = async (connectionId: string) => {
    try {
      await api.delete(`/connections/${connectionId}`);
      setConnections(connections.filter((conn) => conn.id !== connectionId));
    } catch (error) {
      setError('Failed to disconnect platform');
      console.error('Error disconnecting platform:', error);
    }
  };

  const handleConnect = (platform: string) => {
    // Redirect to platform OAuth flow
    window.location.href = `/api/auth/${platform.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Platform Connections
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Connect your blog and social media platforms.
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {error}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Blog Platforms */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Blog Platforms
                  </h4>
                  <div className="mt-4 space-y-4">
                    {['WEBFLOW', 'WORDPRESS', 'MEDIUM'].map((platform) => {
                      const connection = connections.find(
                        (c) => c.platform === platform
                      );
                      return (
                        <div
                          key={platform}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {platform}
                            </p>
                            {connection && (
                              <p className="text-sm text-gray-500">
                                Connected as {connection.platformUserName}
                              </p>
                            )}
                          </div>
                          {connection ? (
                            <button
                              type="button"
                              onClick={() => handleDisconnect(connection.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Disconnect
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleConnect(platform)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Social Media Platforms */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Social Media Platforms
                  </h4>
                  <div className="mt-4 space-y-4">
                    {['LINKEDIN', 'TWITTER'].map((platform) => {
                      const connection = connections.find(
                        (c) => c.platform === platform
                      );
                      return (
                        <div
                          key={platform}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {platform}
                            </p>
                            {connection && (
                              <p className="text-sm text-gray-500">
                                Connected as {connection.platformUserName}
                              </p>
                            )}
                          </div>
                          {connection ? (
                            <button
                              type="button"
                              onClick={() => handleDisconnect(connection.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Disconnect
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleConnect(platform)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Automation Settings
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Configure how your social media posts are created and published.
              </p>
            </div>
          </div>

          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <fieldset>
                  <div className="space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="auto-post"
                          name="auto-post"
                          type="checkbox"
                          checked={autoPost}
                          onChange={(e) => setAutoPost(e.target.checked)}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="auto-post"
                          className="font-medium text-gray-700"
                        >
                          Auto-post to social media
                        </label>
                        <p className="text-gray-500">
                          Automatically create and post social media content
                          when new blog posts are detected
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="require-review"
                          name="require-review"
                          type="checkbox"
                          checked={requireReview}
                          onChange={(e) => setRequireReview(e.target.checked)}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="require-review"
                          className="font-medium text-gray-700"
                        >
                          Review before posting
                        </label>
                        <p className="text-gray-500">
                          Require manual review of generated social media
                          content before posting
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
