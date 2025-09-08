import { MainLayout } from '../layouts/main.layout';
import { NotFound } from '../pages/404';
import { Login } from '../pages/Login/Login';

export const publicRoutes = [
  {
    path: '',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
];