import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const { isLoading, error, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  // Clear localStorage on fresh auth callback to ensure clean state
  useEffect(() => {
    if (window.location.search.includes('code=')) {
      // This is a fresh auth callback from Auth0
      console.log('Fresh auth callback detected, clearing localStorage');
      localStorage.removeItem('userRole');
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      console.log('AuthCallback - Processing login for user:', user.email);
      
      // Check if user has a role assigned in Auth0 metadata (the authoritative source)
      const appMetadata = (user as any)['https://bankdojo.app/app_metadata'];
      const userMetadata = (user as any)['https://bankdojo.app/user_metadata'];
      
      // Only trust Auth0 metadata for role assignment, not localStorage for new logins
      let userRole = appMetadata?.role || userMetadata?.role;
      
      console.log('AuthCallback - role detection:', {
        userEmail: user.email,
        appMetadataRole: appMetadata?.role,
        userMetadataRole: userMetadata?.role,
        finalRole: userRole,
        currentPath: window.location.pathname,
        willRequireRoleSelection: !userRole
      });
      
      if (!userRole) {
        // No role in Auth0 metadata - user needs to select role
        console.log('AuthCallback - No role found, redirecting to role selection');
        
        // Clear any stale localStorage role data
        localStorage.removeItem('userRole');
        
        setTimeout(() => {
          navigate('/setup', { replace: true });
        }, 100);
        return;
      }

      // User has a role in Auth0 - store it locally and redirect to appropriate dashboard
      console.log('AuthCallback - User has role:', userRole, 'storing and redirecting');
      localStorage.setItem('userRole', userRole);
      
      const targetUrl = userRole === 'teacher' ? '/teacher' : '/student';
      
      setTimeout(() => {
        navigate(targetUrl, { replace: true });
      }, 100);
    } else if (!isLoading && error) {
      console.error('Auth0 callback error:', error);
      // Redirect back to home on error
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    }
  }, [isLoading, isAuthenticated, user, error, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light">
        <Card className="p-8 space-y-4 text-center max-w-md">
          <h2 className="text-xl font-semibold text-destructive">Authentication Error</h2>
          <p className="text-muted-foreground">
            {error.message || "There was a problem with authentication"}
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting back to home page...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light">
      <Card className="p-8 space-y-4 text-center">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-coin to-coin-shine flex items-center justify-center mx-auto">
          <Loader2 className="h-8 w-8 animate-spin text-accent-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Completing Sign In...</h2>
        <p className="text-muted-foreground">
          Please wait while we set up your BankDojo Jr. experience
        </p>
      </Card>
    </div>
  );
};

export default AuthCallback;