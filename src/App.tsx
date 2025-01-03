import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import SharedGallery from "./pages/SharedGallery";
import GetStarted from "./pages/GetStarted";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Initialize Supabase auth session
    const initializeAuth = async () => {
      try {
        // If we're on a shared gallery route, skip auth check completely
        if (location.pathname.startsWith('/shared/')) {
          console.log('Shared gallery route detected, skipping auth check');
          setIsInitialized(true);
          return;
        }

        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Failed to get session:', error);
          setIsInitialized(true);
          navigate('/auth');
          return;
        }
        
        setSession(currentSession);
        if (!currentSession) {
          console.log('No active session found');
          navigate('/auth');
        } else {
          console.log('Active session found:', currentSession);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setIsInitialized(true);
        navigate('/auth');
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, 'New session:', newSession);
      setSession(newSession);
      
      // Don't handle auth changes if on shared gallery route
      if (location.pathname.startsWith('/shared/')) {
        console.log('On shared gallery route, ignoring auth change');
        return;
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing state');
        setSession(null);
        queryClient.clear();
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && newSession) {
        console.log('User signed in successfully');
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // If on shared gallery route, render immediately without waiting for auth
  if (location.pathname.startsWith('/shared/')) {
    return (
      <Routes>
        <Route path="/shared/:accessCode" element={<SharedGallery />} />
      </Routes>
    );
  }

  // Show loading spinner while initializing auth (only for non-shared routes)
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/shared/:accessCode" element={<SharedGallery />} />
      <Route path="/" element={<Index />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;