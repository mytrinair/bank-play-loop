import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, GraduationCap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RoleSelector = () => {
  const { userInfo, getAccessToken, setUserRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const assignRole = async (role: 'student' | 'teacher') => {
    setIsSubmitting(true);
    
    try {
      console.log('Setting role to:', role);
      
      // Set role using the useAuth helper function
      setUserRole(role);
      
      console.log('Role set, localStorage now has:', localStorage.getItem('userRole'));
      
      toast.success(`Welcome, ${role}! Setting up your dashboard...`);
      
      // Wait a bit for the role to be properly set in the auth context
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const targetPath = role === 'teacher' ? '/teacher' : '/student';
      console.log('Navigating to:', targetPath);
      
      navigate(targetPath, { replace: true });
      
    } catch (error) {
      console.error('Failed to assign role:', error);
      toast.error('Failed to set up your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="text-center pb-2">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-coin to-coin-shine flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏦</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome to BankDojo Jr!</CardTitle>
          <CardDescription className="text-base">
            Hi <span className="font-semibold text-foreground">{userInfo.name}</span>! 
            <br />Please select your role to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button
            onClick={() => assignRole('student')}
            disabled={isSubmitting}
            className="w-full h-16 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <UserCheck className="w-6 h-6 mr-2" />
            )}
            I'm a Student
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          
          <Button
            onClick={() => assignRole('teacher')}
            disabled={isSubmitting}
            className="w-full h-16 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <GraduationCap className="w-6 h-6 mr-2" />
            )}
            I'm a Teacher
          </Button>

          <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              You can change this later in your profile settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;