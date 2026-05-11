import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/login/user" replace />;
  }
  
  const user = JSON.parse(userStr);
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not allowed, redirect to their respective home
    if (user.role === 'artist') return <Navigate to="/artist/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
