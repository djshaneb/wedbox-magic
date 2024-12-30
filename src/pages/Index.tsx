import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { Camera, LogOut, ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/auth");
  };

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[240px] sm:w-[280px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate("/get-started")}
            className="justify-start"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Get Started
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleLogout}
            className="justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-wedding-pink/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <h1 className="font-semibold text-lg md:text-xl flex items-center gap-2 group">
                <Camera className="h-5 w-5 text-wedding-pink transition-transform group-hover:scale-110" />
                <span className="bg-gradient-to-r from-wedding-pink to-pink-400 bg-clip-text text-transparent font-bold tracking-tight">
                  Wedding Win
                </span>
              </h1>
              <span className="text-[10px] md:text-sm uppercase font-medium tracking-wider text-gray-600 ml-7 md:ml-8">
                Photo Share
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isMobile ? (
                <MobileMenu />
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => navigate("/get-started")}
                    className="text-wedding-pink hover:text-wedding-pink/80"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <main className={`container mx-auto ${isMobile ? 'px-2 pt-20' : 'p-6 pt-24'}`}>
        <PhotoGallery />
      </main>
    </div>
  );
};

export default Index;