import { Photo } from "@/hooks/use-photos";
import { PhotoCard } from "./PhotoCard";
import Masonry from 'react-masonry-css';

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
  onLikeUpdate
}: PhotoGridProps) => {
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
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
          isSharedView={isSharedView}
          onLikeUpdate={onLikeUpdate}
        />
      ))}
    </Masonry>
  );
};