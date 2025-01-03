import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Photo } from "@/hooks/use-photos";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { useEffect, useRef, useState } from "react";
import { CloseButton } from "./lightbox/CloseButton";
import { DeleteButton } from "./lightbox/DeleteButton";
import { DeletePhotoDialog } from "./lightbox/DeletePhotoDialog";
import { LightboxFooter } from "./lightbox/LightboxFooter";
import { LikeButton } from "./lightbox/LikeButton";
import { usePhotoLikes } from "@/hooks/use-photo-likes";

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
  onLikeUpdate,
}: PhotoLightboxProps) => {
  const [index, setIndex] = useState(currentIndex);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { likeCount, isLiked, toggleLike } = usePhotoLikes(
    photos[index]?.id,
    0,
    false
  );

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleNext = () => {
    if (index < photos.length - 1) {
      setIndex(index + 1);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      handlePrevious();
    } else if (event.key === "ArrowRight") {
      handleNext();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index]);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeGesture({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
  });

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[index];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent
          className="max-w-7xl w-full h-[calc(100vh-2rem)] p-0 gap-0 bg-black/90"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
              {!isSharedView && onDelete && (
                <DeleteButton onClick={() => setShowDeleteDialog(true)} />
              )}
              <CloseButton onClick={onClose} />
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={currentPhoto.url}
                alt="Lightbox"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <LightboxFooter
              currentIndex={index + 1}
              totalPhotos={photos.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              showNavigation={photos.length > 1}
            >
              {!isSharedView && (
                <LikeButton
                  isLiked={isLiked}
                  likeCount={likeCount}
                  onClick={async () => {
                    await toggleLike();
                    onLikeUpdate?.(
                      currentPhoto.id,
                      !isLiked,
                      isLiked ? likeCount - 1 : likeCount + 1
                    );
                  }}
                />
              )}
            </LightboxFooter>
          </div>
        </DialogContent>
      </Dialog>

      <DeletePhotoDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          onDelete?.(currentPhoto);
          setShowDeleteDialog(false);
        }}
      />
    </>
  );
};