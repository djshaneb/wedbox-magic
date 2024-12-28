import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { useIsMobile } from "@/hooks/use-mobile";
import { Camera } from "lucide-react";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <div className={`container mx-auto ${isMobile ? 'p-2' : 'p-6'}`}>
        <h1 className={`font-bold ${isMobile ? 'text-2xl mb-4' : 'text-4xl mb-6'} text-center flex items-center justify-center gap-2`}>
          <Camera className="h-6 w-6" />
          Photo Gallery
        </h1>
        
        <Card className="border-0 shadow-none">
          <CardHeader className={isMobile ? 'px-2 py-3' : 'p-6'}>
            <CardTitle>Photo Gallery</CardTitle>
            <CardDescription>Share and view wedding photos with your guests</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? 'px-2' : 'px-6'}>
            <PhotoGallery />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;