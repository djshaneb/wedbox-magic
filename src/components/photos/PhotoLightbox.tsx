import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { CloseButton } from "./lightbox/CloseButton";
import { LikeButton } from "./lightbox/LikeButton";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
          slideFooter: () => !isSharedView && (
            <>
              {onDelete && (
                <div className="absolute bottom-4 left-4">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              )}
              <div className="absolute bottom-4 right-4">
                <LikeButton 
                  photo={photos[currentIndex]}
                  onLikeUpdate={onLikeUpdate}
                />
              </div>
            </>
          )
        }}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the photo from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};