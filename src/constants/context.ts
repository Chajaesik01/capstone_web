import type { AuthContextType } from '@/types/types';
import { createContext, useContext } from 'react';

export const useAuth = () => useContext(AuthContext);

export const AuthContext = createContext<AuthContextType>({
  userId: undefined,
  setUserId: () => {},
});
