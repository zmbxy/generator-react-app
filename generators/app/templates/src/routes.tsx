import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import APP from './views/App';

const Demo = lazy(() => import('./views/Demo'));

const routes = [
  {
    path: `/`,
    element: <APP />,
    caseSensitive: true,
    // errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        hide: true,
        element: <Navigate replace to="/demo" />,
      },
      {
        path: '/demo',
        name: 'demo',
        element: <Demo />,
        // errorElement: <RouteErrorBoundary />,
      },
    ],
  },
];

export default routes;
