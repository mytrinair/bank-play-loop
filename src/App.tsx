import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { StudentProtectedRoute, TeacherProtectedRoute, ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AuthCallback from "./pages/AuthCallback";
import RoleSelector from "./components/RoleSelector";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Auth0 configuration from the PRD
const auth0Config = {
  domain: "mytrinair.us.auth0.com",
  clientId: "lco6d89YBIyeRpjKsl5bmIvqiEST9ixP",
  authorizationParams: {
    redirect_uri: `${window.location.origin}/callback`,
    // audience: "https://bankdojo-jr-api", // Removed for now - will add after API is configured in Auth0
    scope: "openid profile email"
  }
};

const App = () => (
  <Auth0Provider
    domain={auth0Config.domain}
    clientId={auth0Config.clientId}
    authorizationParams={auth0Config.authorizationParams}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/callback" element={<AuthCallback />} />
            <Route path="/setup" element={<RoleSelector />} />
            <Route 
              path="/student" 
              element={
                <StudentProtectedRoute>
                  <StudentDashboard />
                </StudentProtectedRoute>
              } 
            />
            <Route 
              path="/teacher" 
              element={
                <TeacherProtectedRoute>
                  <TeacherDashboard />
                </TeacherProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Auth0Provider>
);

export default App;
