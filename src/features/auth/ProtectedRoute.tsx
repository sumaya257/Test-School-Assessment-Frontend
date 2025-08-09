import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import type { JSX } from 'react';


interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
