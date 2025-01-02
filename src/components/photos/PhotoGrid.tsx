import { Photo } from "@/hooks/use-photos";
import { PhotoCard } from "./PhotoCard";
import Masonry from "react-masonry-css";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  isMobile: boolean;
  isSharedView?: boolean;
  onLikeUpdate?: (photoId: string, isLiked: boolean, likeCount: number) => void;
}

export const PhotoGrid = ({
  photos,
  onPhotoClick,
  isMobile,
  isSharedView = false,
  onLikeUpdate,
}: PhotoGridProps) => {
  const breakpointColumns = {
    default: 5,
    1536: 4,
    1280: 4,
    1024: 3,
    768: 2,
    640: 2,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-3 w-auto"
      columnClassName="pl-3"
    >
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onClick={() => onPhotoClick(index)}
          isMobile={isMobile}
          isSharedView={isSharedView}
          onLikeUpdate={onLikeUpdate}
        />
      ))}
    </Masonry>
  );
};