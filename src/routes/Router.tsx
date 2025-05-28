import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ROUTER_PATH } from '../constants/constansts';
import HomePage from '@/pages/Homepage';
import DashboardPage from '@/pages/DashboardPage';
export const Router = () => {
  const { HOME, MYPAGE, LOGIN, DASHBOARD, SIGNUP } = ROUTER_PATH;

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
