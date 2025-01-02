import { Card } from "@/components/ui/card";
import { Photo } from "@/hooks/use-photos";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onLike?: () => void;
  onUnlike?: () => void;
  isMobile: boolean;
  hideDelete?: boolean;
}

export const PhotoCard = ({ 
  photo, 
  onClick, 
  onLike,
  onUnlike,
  isMobile,
}: PhotoCardProps) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photo.is_liked) {
      onUnlike?.();
    } else {
      onLike?.();
    }
  };

  return (
    <Card 
      className={`mb-2 overflow-hidden ${
        isMobile ? 'shadow-none border-violet-200/20' : 'shadow-md'
      } cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group relative`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={photo.thumbnail_url || photo.url}
          alt="Gallery photo"
          className="w-full h-full object-cover aspect-square md:aspect-auto group-hover:brightness-105 transition-all duration-300"
          loading="lazy"
        />
        {(onLike || onUnlike) && (
          <button
            onClick={handleLikeClick}
            className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm p-2 rounded-full transition-all duration-300 hover:bg-black/70"
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-colors",
                photo.is_liked ? "text-red-500 fill-red-500" : "text-white"
              )} 
            />
            {photo.likes_count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {photo.likes_count}
              </span>
            )}
          </button>
        )}
      </div>
    </Card>
  );
};