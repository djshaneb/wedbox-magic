import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { useIsMobile } from "@/hooks/use-mobile";
import { Camera, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { OnboardingGuide } from "@/components/photos/OnboardingGuide";

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-wedding-pink/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2">
                <Camera className="h-5 w-5 text-wedding-pink" />
                <span className="bg-gradient-to-r from-wedding-pink to-pink-400 bg-clip-text text-transparent font-bold">
                  Wedding Win
                </span>
              </h1>
              <span className="text-xs md:text-sm font-medium text-gray-600">PHOTO SHARE</span>
            </div>
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      <main className={`container mx-auto ${isMobile ? 'px-2 pt-20' : 'p-6 pt-24'}`}>
        <PhotoGallery />
        <OnboardingGuide />
      </main>
    </div>
  );
};

export default Index;