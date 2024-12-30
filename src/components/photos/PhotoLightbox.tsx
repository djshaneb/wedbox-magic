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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && photos[currentIndex]) {
      await onDelete(e, photos[currentIndex]);
    }
  };

  const toolbar = {
    buttons: [
      onDelete && (
        <DeleteButton 
          key="delete" 
          onClick={handleDelete}
          className="ml-2"  // Changed from mr-2 to ml-2
        />
      ),
      <CloseButton key="close" onClose={onClose} />
    ].filter(Boolean)
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
    </div>
  );
};