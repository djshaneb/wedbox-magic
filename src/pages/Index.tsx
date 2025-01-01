import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Plus, Upload, Camera, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPhotoBooth, setIsPhotoBooth] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={`container mx-auto ${isMobile ? 'px-2' : 'p-6'}`}>
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            size="icon"
            className={`relative h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105 ${isMenuOpen ? 'rotate-45' : ''}`}
          >
            <Plus className={`h-5 w-5 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isMenuOpen && (
            <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl p-2 space-y-2 animate-fade-in">
              <Button
                onClick={() => {
                  document.getElementById("photo-upload")?.click();
                  setIsMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Photos
              </Button>
              
              {isMobile && (
                <Button
                  onClick={() => {
                    document.getElementById("camera-capture")?.click();
                    setIsMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Camera className="mr-2 h-4 w-4" /> Take Photo
                </Button>
              )}
              
              <Button
                onClick={() => {
                  setIsPhotoBooth(!isPhotoBooth);
                  setIsMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start"
              >
                <Image className="mr-2 h-4 w-4" /> Photo Booth Mode
              </Button>
            </div>
          )}

          <MobileMenu />
        </div>
        <PhotoGallery isPhotoBooth={isPhotoBooth} setIsPhotoBooth={setIsPhotoBooth} />
      </main>
    </div>
  );
};

export default Index;