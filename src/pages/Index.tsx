import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { useIsMobile } from "@/hooks/use-mobile";
import { Camera } from "lucide-react";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col items-start">
            <h1 className="font-semibold text-xl flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-500" />
              <span>Wedding Win</span>
            </h1>
            <span className="text-sm font-medium text-purple-600">PHOTO SHARE</span>
          </div>
        </div>
      </div>
      
      <main className={`container mx-auto ${isMobile ? 'px-2 pt-16' : 'p-6'}`}>
        <PhotoGallery />
      </main>
    </div>
  );
};

export default Index;