import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { CloseButton } from "./lightbox/CloseButton";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";

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
  photos,
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
      />
    </div>
  );
};