import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && photos[currentIndex]) {
      onDelete(e, photos[currentIndex]);
      onClose();
    }
  };

  const toolbar = {
    buttons: onDelete ? [
      "close",
      <Button
        key="delete"
        variant="destructive"
        size="icon"
        className="bg-red-500 hover:bg-red-600 text-white absolute bottom-4 left-4"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    ] : ["close"]
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
    </div>
  );
};