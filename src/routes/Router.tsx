import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import { ROUTER_PATH } from '../constants/constansts';
import HomePage from '@/pages/Homepage';
import DashboardPage from '@/pages/DashboardPage';
import AuthPage from '@/pages/AuthPage';
import { useAuth } from '@/constants/context';
import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();

  if (!userId) {
    return <Navigate to={ROUTER_PATH.AUTH} replace />;
  }

  return <>{children}</>;
};

const DefaultRoute = () => {
  const { userId } = useAuth();
  const { DASHBOARD, AUTH } = ROUTER_PATH;

  if (userId) {
    return <Navigate to={DASHBOARD} replace />;
  }
  return <Navigate to={AUTH} replace />;
};

export const Router = () => {
  const { HOME, MYPAGE, LOGIN, DASHBOARD, SIGNUP, AUTH } = ROUTER_PATH;

  const router = createBrowserRouter([
    {
      path: '/',
      element: <DefaultRoute />,
    },
    {
      path: HOME,
      element: <HomePage />,
    },
    {
      path: MYPAGE,
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: DASHBOARD,
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: AUTH,
      element: <AuthPage />,
    },
    {
      path: SIGNUP,
      element: <SIGNUP />,
    },
    {
      path: LOGIN,
      element: <LOGIN />,
    },
  ]);

  return <RouterProvider router={router} />;
};
