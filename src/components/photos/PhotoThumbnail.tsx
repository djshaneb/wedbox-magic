import { cn } from "@/lib/utils";
import { Photo } from "@/hooks/use-photos";
import { useIsMobile } from "@/hooks/use-mobile";

interface PhotoThumbnailProps {
  photo: Photo;
  onClick?: () => void;
  className?: string;
}

export const PhotoThumbnail = ({ photo, onClick, className }: PhotoThumbnailProps) => {
  const isMobile = useIsMobile();
  
  return (
    <img
      src={photo.thumbnail_url}
      alt="Gallery photo"
      className={cn(
        "w-full h-full object-cover aspect-square md:aspect-auto group-hover:brightness-105 transition-all duration-300",
        className
      )}
      onClick={onClick}
      loading="lazy"
      decoding="async"
      width={isMobile ? "48" : "96"}
      height={isMobile ? "48" : "96"}
    />
  );
};