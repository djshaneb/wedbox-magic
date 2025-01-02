import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@/hooks/use-photos";
import { CloseButton } from "./lightbox/CloseButton";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const { toast } = useToast();
  useSwipeGesture(onClose);

  // Fetch initial like state when photo changes
  useEffect(() => {
    const fetchLikeState = async () => {
      if (!photos[currentIndex]) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: likes } = await supabase
        .from('photo_likes')
        .select('*')
        .eq('photo_id', photos[currentIndex].id);

      const userLike = likes?.find(like => like.user_id === user.id);
      setIsLiked(!!userLike);
      setLikeCount(likes?.length || 0);
    };

    if (isOpen && !isSharedView) {
      fetchLikeState();
    }
  }, [currentIndex, isOpen, photos, isSharedView]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(photos[currentIndex]);
    }
    setShowDeleteDialog(false);
  };

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!isLiked) {
        await supabase
          .from('photo_likes')
          .insert([{ photo_id: photos[currentIndex].id, user_id: user.id }]);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        if (onLikeUpdate) {
          onLikeUpdate(photos[currentIndex].id, true, likeCount + 1);
        }
        toast({
          title: "Photo liked!",
          description: "You've liked this photo",
        });
      } else {
        await supabase
          .from('photo_likes')
          .delete()
          .match({ photo_id: photos[currentIndex].id, user_id: user.id });
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        if (onLikeUpdate) {
          onLikeUpdate(photos[currentIndex].id, false, likeCount - 1);
        }
        toast({
          title: "Like removed",
          description: "You've unliked this photo",
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      handleLike();
    } else {
      setLastTap(now);
    }
  }, [lastTap, handleLike]);

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
            <div 
              onTouchStart={!isSharedView ? handleDoubleTap : undefined}
              className="w-full h-full flex items-center justify-center"
            >
              <img 
                src={slide.src} 
                alt="" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ),
          slideFooter: () => !isSharedView && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                onClick={handleLike}
              >
                <Heart 
                  className={`h-5 w-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                />
                {likeCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {likeCount}
                  </span>
                )}
              </Button>
              {onDelete && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
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