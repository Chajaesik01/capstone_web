import { useUserStore } from '@/hooks/auth/auth';
import GlobalStyle from './GlobalStyle';
import { Router } from '@/routes/Router';
import { AuthProvider } from '@/store/AuthContext';
import { useEffect } from 'react';
import { getUserDB, getUserId } from '@/api/api';

function App() {
  const { updateCache } = useUserStore();

  useEffect(() => {
    const initUser = async () => {
      const userId = getUserId();
      if (userId) {
        try {
          const userData = await getUserDB(userId);
          if (userData) {
            updateCache(userData);
          }
        } catch (error: unknown) {
          console.error('초기 사용자 정보 로딩 실패:', error);
        }
      }
    };

    initUser();
  }, [updateCache]);

  return (
    <AuthProvider>
      <GlobalStyle />
      <Router />
    </AuthProvider>
  );
}

export default App;
