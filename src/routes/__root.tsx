import { HomeLayout } from '@/Modules/Global/Layout/HomeLayout';
import { createRootRoute, Outlet, redirect, useLocation } from '@tanstack/react-router';


export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/') {
      throw redirect({ to: '/Login' });
    }
  },
});

function RootComponent() {
  const location = useLocation();
  const isPublicRoute = ['/Login', '/ForgotPassword', '/ResetPassword', '/Unauthorized', '/NotFound'].includes(location.pathname);

  return (
    isPublicRoute ? (
      <Outlet />
    ) : (
      <HomeLayout>
        {() => <Outlet />}
      </HomeLayout>
    )
  );
}