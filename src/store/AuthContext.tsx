import { useState, type ReactNode } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '@/constants/context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(() =>
    Cookies.get('accessToken')
  );

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
