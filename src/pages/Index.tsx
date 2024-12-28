import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { useIsMobile } from "@/hooks/use-mobile";
import { Camera } from "lucide-react";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-wedding-pink/20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col items-start">
            <h1 className="font-semibold text-xl flex items-center gap-2">
              <Camera className="h-5 w-5 text-wedding-pink" />
              <span className="bg-gradient-to-r from-wedding-pink to-pink-400 bg-clip-text text-transparent font-bold">
                Wedding Win
              </span>
            </h1>
            <span className="text-sm font-medium text-gray-600">PHOTO SHARE</span>
          </div>
        </div>
      </div>
      
      <main className={`container mx-auto ${isMobile ? 'px-2 pt-16' : 'p-6 pt-20'}`}>
        <PhotoGallery />
      </main>
    </div>
  );
};

export default Index;