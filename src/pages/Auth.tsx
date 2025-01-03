import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "@/components/photos/share/QRScanner";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [eventId, setEventId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // If we're coming from a shared gallery route, don't check auth
    if (location.state?.from?.startsWith('/shared/')) {
      return;
    }

    // Check current auth session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const handleEventAccess = async () => {
    if (!eventId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event ID",
        variant: "destructive"
      });
      return;
    }

    // Verify if the event ID exists
    const { data: gallery, error } = await supabase
      .from('shared_galleries')
      .select('*')
      .eq('access_code', eventId.trim())
      .single();

    if (error || !gallery) {
      toast({
        title: "Invalid Event ID",
        description: "The event ID you entered is not valid",
        variant: "destructive"
      });
      return;
    }

    // Navigate to the shared gallery
    navigate(`/shared/${eventId.trim()}`);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FEF7CD] flex items-center justify-center p-4">
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
        
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or attend an event
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Enter Event Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Event ID</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Enter event ID (e.g., 1QXVCV)"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEventAccess();
                      }
                    }}
                  />
                  <Button 
                    className="w-full"
                    onClick={handleEventAccess}
                  >
                    Access Gallery
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <QRScanner />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;