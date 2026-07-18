import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/lib/configs/routes';

export const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    // ignore
  }

  if (!token || !user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (user.role !== 'ROLE_ADMIN') {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
};
