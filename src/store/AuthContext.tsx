import { useState, type ReactNode } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '@/constants/context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | undefined>(() =>
    Cookies.get('userId')
  );

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
