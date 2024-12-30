import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { CloseButton } from "./lightbox/CloseButton";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";

interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  photos: Photo[];
  onDelete?: (photo: Photo) => void;
  isSharedView?: boolean;
}

export const PhotoLightbox = ({
  isOpen,
  onClose,
  currentIndex,
  photos,
  onDelete,
  isSharedView = false
}: PhotoLightboxProps) => {
  useSwipeGesture(onClose);

  return (
    <div className="relative">
      <Lightbox
        open={isOpen}
        close={onClose}
        index={currentIndex}
        slides={photos.map(photo => ({ src: photo.url }))}
        toolbar={{
          buttons: [
            <CloseButton key="close" onClose={onClose} />
          ]
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          root: { zIndex: 40 }
        }}
        render={{
          iconNext: () => null,
          iconPrev: () => null,
          buttonNext: () => null,
          buttonPrev: () => null,
          buttonZoom: () => null,
          slideFooter: () => !isSharedView && onDelete && (
            <div className="absolute bottom-4 left-4">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(photos[currentIndex])}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          )
        }}
      />
    </div>
  );
};