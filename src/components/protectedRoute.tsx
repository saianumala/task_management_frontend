import { JSX } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../customHooks/useAuth";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
