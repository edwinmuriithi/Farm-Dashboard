import Account from './pages/Account';
import Users from './pages/Users';
import Reports from './pages/MOH405';
import Index from './pages/Index';
import Messages from './pages/Messages';

const appRoutes = [
  {
    path: '/',
    element: Index,
  },
  {
    path: '/users',
    element: Users,
  },
  {
    path: '/moh-reports',
    element: Reports,
  },
  {
    path: '/account',
    element: Account,
  },
  {
    path: '/messaging',
    element: Messages,
  }
];

export default appRoutes;
