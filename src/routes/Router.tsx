import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ROUTER_PATH } from '../constants/constansts';
import HomePage from '@/pages/Homepage';
import DashboardPage from '@/pages/DashboardPage';
import AuthPage from '@/pages/AuthPage';
import Navigation from '@/components/common/nav/Navigation';
import MapDisplayPage from '@/pages/MapDisplayPage';
import { useAuth } from '@/constants/context';
import type { ReactNode } from 'react';
import MyPage from '@/pages/MyPage';

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

const LayoutWithNav = () => {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
};

const LayoutWithoutNav = () => {
  return <Outlet />;
};

export const Router = () => {
  const { HOME, MYPAGE, DASHBOARD, AUTH, MAP_VISUALIZATION } = ROUTER_PATH;

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutWithNav />,
      children: [
        {
          index: true,
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
              <MyPage />
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
      ],
    },
    {
      path: '/',
      element: <LayoutWithoutNav />,
      children: [
        {
          path: AUTH,
          element: <AuthPage />,
        },
      ],
    },
    {
      path: MAP_VISUALIZATION,
      element: <MapDisplayPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};
