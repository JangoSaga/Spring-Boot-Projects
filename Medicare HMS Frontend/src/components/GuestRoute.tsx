import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated && user) {
    const rolePath = user.role.toLowerCase();
    return <Navigate to={`/${rolePath}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
