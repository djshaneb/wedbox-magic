import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { LikeButton } from "./LikeButton";
import { Photo } from "@/hooks/use-photos";

interface LightboxFooterProps {
  isSharedView: boolean;
  onDelete?: () => void;
  currentPhoto: Photo;
  onLikeUpdate?: (photoId: string, isLiked: boolean, likeCount: number) => void;
}

export const LightboxFooter = ({
  isSharedView,
  onDelete,
  currentPhoto,
  onLikeUpdate,
}: LightboxFooterProps) => {
  if (isSharedView) return null;

  return (
    <>
      {onDelete && (
        <div className="absolute bottom-4 left-4">
          <Button
            variant="destructive"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      )}
      <div className="absolute bottom-4 right-4">
        <LikeButton 
          photo={currentPhoto}
          onLikeUpdate={onLikeUpdate}
        />
      </div>
    </>
  );
};