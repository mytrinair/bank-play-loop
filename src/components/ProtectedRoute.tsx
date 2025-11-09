import { useAuth, UserRole } from "@/hooks/use-auth";
import { Navigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole,
  fallbackPath = "/"
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, userRole, needsRoleSelection, loginWithRedirect, error } = useAuth();
  const location = useLocation();

  // Show loading spinner while Auth0 is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light">
        <Card className="p-8 space-y-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Checking your authentication status</p>
        </Card>
      </div>
    );
  }

  // Show error state if Auth0 encountered an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light">
        <Card className="p-8 space-y-4 text-center max-w-md">
          <AlertTriangle className="h-8 w-8 mx-auto text-destructive" />
          <h2 className="text-xl font-semibold">Authentication Error</h2>
          <p className="text-muted-foreground">
            {error.message || "There was a problem with authentication"}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light">
        <Card className="p-8 space-y-4 text-center max-w-md">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground">
            You need to log in to access this page.
          </p>
          <Button 
            onClick={() => loginWithRedirect({
              authorizationParams: {
                redirect_uri: window.location.origin + location.pathname
              }
            })}
          >
            Log In
          </Button>
        </Card>
      </div>
    );
  }

  // Redirect to role selection if user needs to choose role AND a specific role is required
  if (needsRoleSelection && requiredRole) {
    return <Navigate to="/setup" replace />;
  }

  // Check role-based access if a specific role is required
  if (requiredRole && userRole !== requiredRole) {
    console.log('ProtectedRoute - Access denied:', {
      requiredRole,
      userRole,
      currentPath: location.pathname,
      mismatch: true
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light">
        <Card className="p-8 space-y-4 text-center max-w-md">
          <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page. This page requires {requiredRole} privileges.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Current role: {userRole || 'No role assigned'}
            </p>
            <Button onClick={() => Navigate({ to: fallbackPath, replace: true })}>
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // All checks passed - render the protected content
  console.log('ProtectedRoute - Access granted:', {
    requiredRole,
    userRole,
    currentPath: location.pathname,
    authenticated: isAuthenticated
  });
  return <>{children}</>;
};

// Specific route guards for common use cases
export const StudentProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requiredRole="student" fallbackPath="/">
    {children}
  </ProtectedRoute>
);

export const TeacherProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requiredRole="teacher" fallbackPath="/">
    {children}
  </ProtectedRoute>
);

// Loading component for better UX
export const AuthLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light">
    <Card className="p-8 space-y-4 text-center">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-coin to-coin-shine flex items-center justify-center mx-auto">
        <Loader2 className="h-8 w-8 animate-spin text-accent-foreground" />
      </div>
      <h2 className="text-xl font-semibold">BankDojo Jr.</h2>
      <p className="text-muted-foreground">Setting up your experience...</p>
    </Card>
  </div>
);