import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { useState } from "react";
import { AlbumList } from "@/components/albums/AlbumList";
import { Navigation } from "@/components/navigation/Navigation";
import { ThemeContent } from "@/components/theme/ThemeContent";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [isPhotoBooth, setIsPhotoBooth] = useState(false);
  const [activeTab, setActiveTab] = useState<"photos" | "albums" | "theme">("photos");
  const [bgColor, setBgColor] = useState("bg-background");

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgColor}`}>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className={`container mx-auto ${isMobile ? 'px-2' : 'p-6'} mt-32`}>
        {activeTab === "photos" ? (
          <PhotoGallery isPhotoBooth={isPhotoBooth} setIsPhotoBooth={setIsPhotoBooth} />
        ) : activeTab === "albums" ? (
          <AlbumList />
        ) : (
          <ThemeContent bgColor={bgColor} setBgColor={setBgColor} />
        )}
      </main>
    </div>
  );
};

export default Index;