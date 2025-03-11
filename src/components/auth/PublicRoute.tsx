
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  // Wait until auth state is determined
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not authenticated, render the children
  return <>{children}</>;
};
