import { useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import type { UserType } from '@/types/types';
import { getUserInfo } from '@/api/auth/api';

export const useUserStore = () => {
  const queryClient = useQueryClient();

  const accessToken = Cookies.get('accessToken');

  const authUser = useQuery({
    queryKey: ['user', 'auth', accessToken],
    queryFn: () => getUserInfo(),
    enabled: !!accessToken,
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
      queryClient.setQueryData(['user', 'auth', accessToken], userData);
    },
  };
};
