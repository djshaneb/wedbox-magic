import { Button } from "@/components/ui/button";
import { Camera, Plus, Upload, Image } from "lucide-react";

interface SharedGalleryHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  setIsPhotoBooth: (value: boolean) => void;
}

export const SharedGalleryHeader = ({
  isMenuOpen,
  setIsMenuOpen,
  setIsPhotoBooth,
}: SharedGalleryHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-wedding-pink/20 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <h1 className="font-semibold text-xl flex items-center gap-2">
              <Camera className="h-5 w-5 text-wedding-pink" />
              <span className="bg-gradient-to-r from-wedding-pink to-pink-400 bg-clip-text text-transparent font-bold">
                Wedding Win
              </span>
            </h1>
            <span className="text-sm font-medium text-gray-600">PHOTO SHARE</span>
          </div>

          <div className="flex items-center gap-4">
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
                
                <Button
                  onClick={() => {
                    setIsPhotoBooth(true);
                    setIsMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Image className="mr-2 h-4 w-4" /> Photo Booth Mode
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};