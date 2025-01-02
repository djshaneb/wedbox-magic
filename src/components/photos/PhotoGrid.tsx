import { Photo } from "@/hooks/use-photos";
import { PhotoCard } from "./PhotoCard";
import Masonry from 'react-masonry-css';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  isMobile: boolean;
  isSharedView?: boolean;
  onLikeUpdate?: (photoId: string, isLiked: boolean, likeCount: number) => void;
  showRemoveButton?: boolean;
  onRemovePhoto?: (photoId: string) => void;
}

export const PhotoGrid = ({
  photos,
  onPhotoClick,
  isMobile,
  isSharedView = false,
  onLikeUpdate,
  showRemoveButton = false,
  onRemovePhoto
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
          isMobile={isMobile}
          isSharedView={isSharedView}
          onLikeUpdate={onLikeUpdate}
          showRemoveButton={showRemoveButton}
          onRemovePhoto={onRemovePhoto}
        />
      ))}
    </Masonry>
  );
};