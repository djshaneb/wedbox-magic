import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { CloseButton } from "./lightbox/CloseButton";
import { DeleteButton } from "./lightbox/DeleteButton";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";

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
  useSwipeGesture(onClose);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && photos[currentIndex]) {
      onDelete(e, photos[currentIndex]);
    }
  };

  const toolbar = {
    buttons: [<CloseButton key="close" onClose={onClose} />]
  };

  return (
    <div className="relative">
      <Lightbox
        open={isOpen}
        close={onClose}
        index={currentIndex}
        slides={photos.map(photo => ({ src: photo.url }))}
        toolbar={toolbar}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          root: { zIndex: 40 }
        }}
      />
      {isOpen && onDelete && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <DeleteButton 
            onClick={handleDelete} 
            className="absolute top-4 right-16 pointer-events-auto" 
          />
        </div>
      )}
    </div>
  );
};