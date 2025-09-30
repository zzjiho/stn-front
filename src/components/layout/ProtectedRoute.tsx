import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}