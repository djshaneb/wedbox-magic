import { Photo } from "@/hooks/use-photos";
import { PhotoCard } from "./PhotoCard";
import Masonry from 'react-masonry-css';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  onLike?: (photoId: string) => void;
  onUnlike?: (photoId: string) => void;
  isMobile: boolean;
  isSharedView?: boolean;
}

export const PhotoGrid = ({
  photos,
  onPhotoClick,
  onLike,
  onUnlike,
  isMobile,
  isSharedView = false
}: PhotoGridProps) => {
  const breakpointColumns = {
    default: 3,
    1100: 3,
    768: 3,
    500: 3
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex w-full -ml-1 -mr-1"
      columnClassName="pl-1 pr-1"
    >
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onClick={() => onPhotoClick(index)}
          onLike={onLike ? () => onLike(photo.id) : undefined}
          onUnlike={onUnlike ? () => onUnlike(photo.id) : undefined}
          isMobile={isMobile}
        />
      ))}
    </Masonry>
  );
};