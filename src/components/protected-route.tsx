import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/lib/configs/routes';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to={ROUTES.login} replace />;
  }

  let isAdminOnUserRoute = false;

  try {
    const user = JSON.parse(userStr);
    const pathname = window.location.pathname;

    // Si un admin essaie d'aller sur /dashboard (et ses sous-routes)
    if (user.role === 'ROLE_ADMIN' && pathname.startsWith('/dashboard')) {
        isAdminOnUserRoute = true;
    }
  } catch {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (isAdminOnUserRoute) {
    return <Navigate to={ROUTES.admin.dashboard} replace />;
  }

  return <Outlet />;
};
