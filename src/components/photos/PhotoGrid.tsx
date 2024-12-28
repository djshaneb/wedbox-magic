import { Photo } from "@/hooks/use-photos";
import { PhotoCard } from "./PhotoCard";
import Masonry from 'react-masonry-css';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  onPhotoDelete: (event: React.MouseEvent, photo: Photo) => void;
  isMobile: boolean;
  isSharedView?: boolean;
}

export const PhotoGrid = ({
  photos,
  onPhotoClick,
  onPhotoDelete,
  isMobile,
  isSharedView = false
}: PhotoGridProps) => {
  const breakpointColumns = {
    default: 3,
    1100: 3,
    768: 2,
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
          onDelete={(e) => onPhotoDelete(e, photo)}
          isMobile={isMobile}
          hideDelete={isSharedView}
        />
      ))}
    </Masonry>
  );
};