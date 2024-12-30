import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  photos: Photo[];
  onDelete?: (event: React.MouseEvent, photo: Photo) => void;
}

export const PhotoLightbox = ({
  isOpen,
  onClose,
  currentIndex,
  photos,
  onDelete
}: PhotoLightboxProps) => {
  const touchStartY = useRef<number | null>(null);

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDelete && photos[currentIndex]) {
      try {
        await onDelete(e, photos[currentIndex]);
        onClose();
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  const toolbar = {
    buttons: [
      <Button
        key="close"
        variant="ghost"
        size="icon"
        className="text-white absolute top-4 right-4"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
    ]
  };

  return (
    <div className="relative">
      <Lightbox
        open={isOpen}
        close={onClose}
        index={currentIndex}
        slides={photos.map(photo => ({ src: photo.url }))}
        toolbar={toolbar}
      />
      {onDelete && (
        <Button
          variant="destructive"
          size="icon"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] bg-red-500 hover:bg-red-600 text-white shadow-lg md:left-8 md:translate-x-0 h-12 w-12"
          onClick={handleDelete}
        >
          <Trash2 className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};