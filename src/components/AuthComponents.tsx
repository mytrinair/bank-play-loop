import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface LoginButtonProps {
  variant?: "default" | "secondary" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const StudentLoginButton = ({ variant = "default", size = "default", className }: LoginButtonProps) => {
  const { loginAsStudent, isLoading } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={loginAsStudent}
      disabled={isLoading}
    >
      <User className="h-4 w-4 mr-2" />
      Student Login
    </Button>
  );
};

export const TeacherLoginButton = ({ variant = "default", size = "default", className }: LoginButtonProps) => {
  const { loginAsTeacher, isLoading } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={loginAsTeacher}
      disabled={isLoading}
    >
      <GraduationCap className="h-4 w-4 mr-2" />
      Teacher Login
    </Button>
  );
};

export const LoginButton = ({ variant = "default", size = "default", className }: LoginButtonProps) => {
  const { loginWithRedirect, isLoading } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => loginWithRedirect()}
      disabled={isLoading}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Login
    </Button>
  );
};

export const LogoutButton = ({ variant = "ghost", size = "default", className }: LoginButtonProps) => {
  const { logout, isLoading } = useAuth();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={logout}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
};

export const UserProfile = () => {
  const { userInfo, logout, isTeacher, isStudent } = useAuth();

  if (!userInfo) return null;

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = () => {
    if (isTeacher) return "🧑‍🏫 Teacher";
    if (isStudent) return "👨‍🎓 Student";
    return "👤 User";
  };

  const getRoleColor = () => {
    if (isTeacher) return "text-blue-600";
    if (isStudent) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold">
              {getUserInitials(userInfo.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{userInfo.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
            <p className={`text-xs leading-none font-medium ${getRoleColor()}`}>
              {getRoleBadge()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AuthenticatedHeader = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        {children}
        <UserProfile />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <StudentLoginButton variant="ghost" />
      <TeacherLoginButton />
    </div>
  );
};