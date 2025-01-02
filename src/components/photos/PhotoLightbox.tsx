import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { CloseButton } from "./lightbox/CloseButton";
import { useState } from "react";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { DeletePhotoDialog } from "./lightbox/DeletePhotoDialog";
import { LightboxFooter } from "./lightbox/LightboxFooter";

interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  photos: Photo[];
  onDelete?: (photo: Photo) => void;
  isSharedView?: boolean;
  onLikeUpdate?: (photoId: string, isLiked: boolean, likeCount: number) => void;
}

export const PhotoLightbox = ({
  isOpen,
  onClose,
  currentIndex,
  photos,
  onDelete,
  isSharedView = false,
  onLikeUpdate
}: PhotoLightboxProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  useSwipeGesture(onClose);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(photos[currentIndex]);
    }
    setShowDeleteDialog(false);
  };

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
          slide: ({ slide }) => (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={slide.src} 
                alt="" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ),
          slideFooter: () => (
            <LightboxFooter
              isSharedView={isSharedView}
              onDelete={onDelete ? () => setShowDeleteDialog(true) : undefined}
              currentPhoto={photos[currentIndex]}
              onLikeUpdate={onLikeUpdate}
            />
          )
        }}
      />

      <DeletePhotoDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
};