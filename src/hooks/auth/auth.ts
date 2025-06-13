import { getUserDB, getUserId, type UserType } from '@/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useUserStore = () => {
  const queryClient = useQueryClient();

  const userId = getUserId() || '';

  const authUser = useQuery({
    queryKey: ['user', 'auth', userId],
    queryFn: () => getUserDB(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });

  return {
    user: authUser.data,
    isLoading: authUser.isLoading,
    isAuthenticated: !!authUser.data,
    error: authUser.error,

    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },

    clearCache: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
    },

    updateCache: (userData: UserType) => {
      queryClient.setQueryData(['user', 'auth', userId], userData);
    },
  };
};
