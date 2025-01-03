import { useState } from "react";
import { Photo } from "@/hooks/use-photos";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePhotoLikes } from "@/hooks/use-photo-likes";

interface PhotoCardProps {
  photo: Photo;
  onClick?: () => void;
  isSharedView?: boolean;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
  onLikeUpdate?: (photoId: string, isLiked: boolean, likeCount: number) => void;
  className?: string;
}

export const PhotoCard = ({
  photo,
  onClick,
  isSharedView = false,
  initialLikeCount = 0,
  initialIsLiked = false,
  onLikeUpdate,
  className,
}: PhotoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { likeCount, isLiked, isLoading, toggleLike } = usePhotoLikes(
    photo.id,
    initialLikeCount,
    initialIsLiked
  );

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLike();
    onLikeUpdate?.(photo.id, !isLiked, isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={photo.thumbnail_url}
        alt="Gallery photo"
        className="w-full h-full object-cover aspect-square transition-all duration-300 group-hover:brightness-105"
        loading="lazy"
        decoding="async"
      />
      
      {!isSharedView && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute bottom-2 right-2 h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90",
            isLiked && "text-red-500 hover:text-red-600",
            (isHovered || isLiked) ? "opacity-100" : "opacity-0 md:group-hover:opacity-100",
            "transition-all duration-200"
          )}
          onClick={handleLikeClick}
          disabled={isLoading}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isLiked && "fill-current",
              isLoading && "animate-pulse"
            )}
          />
        </Button>
      )}

      {likeCount > 0 && (
        <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
          {likeCount}
        </div>
      )}
    </div>
  );
};