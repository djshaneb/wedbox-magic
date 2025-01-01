import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Camera } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check current auth session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          return;
        }
        
        if (session) {
          console.log('Active session found, redirecting to home');
          navigate("/");
        }
      } catch (error) {
        console.error('Failed to check session:', error);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (session) {
        // Store the session in localStorage to persist it
        localStorage.setItem('supabase.auth.token', session.access_token);
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-wedding-pink/10 p-3">
              <Camera className="h-8 w-8 text-wedding-pink" />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">
            Welcome to Wedding Win
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to start sharing your wedding photos
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#e69fa3',
                    brandAccent: '#d88f93',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;