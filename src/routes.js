import Account from './pages/Account';
import Users from './pages/Users';
import Index from './pages/Index';
import Messages from './pages/Messages';
import Posts from './pages/Posts';
import Media from './pages/Media';
import Payments from './pages/Payments';

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
    path: '/posts',
    element: Posts,
  },
  {
    path: '/account',
    element: Account,
  },
  {
    path: '/messaging',
    element: Messages,
  },
  {
    path: '/payments',
    element: Payments,
  },
  {
    path: '/media',
    element: Media,
  }
];

export default appRoutes;
