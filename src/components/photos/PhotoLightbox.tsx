import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { useEffect, useRef } from "react";

interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  photos: Photo[];
}

export const PhotoLightbox = ({
  isOpen,
  onClose,
  currentIndex,
  photos
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
      
      // If swipe up distance is more than 100px, close the lightbox
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
    <Lightbox
      open={isOpen}
      close={onClose}
      index={currentIndex}
      slides={photos.map(photo => ({ src: photo.url }))}
    />
  );
};