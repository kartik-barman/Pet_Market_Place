import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const  isLoggedIn  = localStorage.getItem("isLoggedIn");
  const location = useLocation(); // To preserve the original route for redirection

  if (isLoggedIn === undefined) {
    // Render loading state while checking authentication status
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    // Redirect to the home page and preserve the current location in the state
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the protected route
  return children;
};

export default ProtectedRoute;
