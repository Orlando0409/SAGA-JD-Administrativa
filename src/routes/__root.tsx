import { createRootRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => <Outlet/>,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/') {
      throw redirect({
        to: '/Login',
      });
    }
  },
});