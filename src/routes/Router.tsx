import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ROUTER_PATH } from '../constants/constansts';
import HomePage from '@/pages/Homepage';
import DashboardPage from '@/pages/DashboardPage';
import AuthPage from '@/pages/AuthPage';
export const Router = () => {
  const { HOME, MYPAGE, LOGIN, DASHBOARD, SIGNUP, AUTH } = ROUTER_PATH;

  const router = createBrowserRouter([
    {
      path: HOME,
      element: <HomePage />,
    },
    {
      path: MYPAGE,
      element: <MYPAGE />,
    },
    {
      path: DASHBOARD,
      element: <DashboardPage />,
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
