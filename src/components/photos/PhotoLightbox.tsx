import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  photos: Photo[];
  onDelete?: (photo: Photo) => void;
}

export const PhotoLightbox = ({
  isOpen,
  onClose,
  currentIndex,
  photos,
  onDelete
}: PhotoLightboxProps) => {
  const touchStartY = useRef<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartY.current) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchEndY - touchStartY.current;
      
      if (deltaY < -100) {
        onClose();
      }
      
      touchStartY.current = null;
    };

    if (isOpen) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <Lightbox
        open={isOpen}
        close={onClose}
        index={currentIndex}
        slides={photos.map(photo => ({ src: photo.url }))}
      />
      {isOpen && isMobile && onDelete && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]">
          <Button
            variant="destructive"
            size="lg"
            onClick={() => {
              onDelete(photos[currentIndex]);
              onClose();
            }}
            className="bg-red-500 hover:bg-red-600 text-white shadow-lg rounded-full px-6"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Delete Photo
          </Button>
        </div>
      )}
    </>
  );
};