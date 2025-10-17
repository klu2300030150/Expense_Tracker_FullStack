import React from 'react';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
  console.log('PrivateRoute render');
  const userId = localStorage.getItem('userId');
  console.log('userId from storage:', userId);

  if (!userId) {
    console.log('No userId, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated, rendering children');
  return children;
}