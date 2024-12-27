import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import { LoginCredentials, ApiError } from '@/types';

export const useAuth = () => {
  const { login: storeLogin, logout: storeLogout } = useAuthStore();

  const loginMutation = useMutation<void, ApiError, LoginCredentials>({
    mutationFn: async (credentials) => {
      await storeLogin(credentials.email, credentials.password);
    },
  });

  const logoutMutation = useMutation<void, ApiError>({
    mutationFn: async () => {
      storeLogout();
    },
  });

  const verifyQuery = useQuery<void, ApiError>({
    queryKey: ['auth', 'verify'],
    queryFn: async () => {
      // The verify functionality is handled by the initialize function in the store
      useAuthStore.getState().initialize();
    },
    retry: false,
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    verify: verifyQuery.data,
    isLoading:
      loginMutation.isPending ||
      logoutMutation.isPending ||
      verifyQuery.isPending,
    isError:
      loginMutation.isError || logoutMutation.isError || verifyQuery.isError,
    error: loginMutation.error || logoutMutation.error || verifyQuery.error,
  };
};
