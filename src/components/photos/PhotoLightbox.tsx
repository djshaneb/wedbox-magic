import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";

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
}: PhotoLightboxProps) => (
  <Lightbox
    open={isOpen}
    close={onClose}
    index={currentIndex}
    slides={photos.map(photo => ({ src: photo.url }))}
  />
);