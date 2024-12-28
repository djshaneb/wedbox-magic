import React, { useState } from "react";
import { ImageIcon } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useIsMobile } from "@/hooks/use-mobile";
import Masonry from 'react-masonry-css';
import { usePhotos } from "@/hooks/use-photos";
import { PhotoCard } from "./PhotoCard";
import { PhotoUploadSection } from "./PhotoUploadSection";
import { ShareGalleryButton } from "./ShareGalleryButton";

interface PhotoGalleryProps {
  sharedGalleryOwnerId?: string;
  isSharedView?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ 
  sharedGalleryOwnerId,
  isSharedView = false 
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPhotoBooth, setIsPhotoBooth] = useState(false);
  const isMobile = useIsMobile();
  const { photos, isLoading, uploadMutation, deleteMutation } = usePhotos(sharedGalleryOwnerId);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    for (const file of fileArray) {
      await uploadMutation.mutateAsync({
        file,
        ownerId: sharedGalleryOwnerId
      });
    }
  };

  const handlePhotoTaken = async (photoUrl: string) => {
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    await uploadMutation.mutateAsync({
      file,
      ownerId: sharedGalleryOwnerId
    });
  };

  const handleDeletePhoto = async (event: React.MouseEvent, photo: { id: string, storage_path: string }) => {
    event.stopPropagation();
    await deleteMutation.mutateAsync({ 
      id: photo.id, 
      storage_path: photo.storage_path 
    });
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const breakpointColumns = {
    default: 3,
    768: 2,
    500: 2
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PhotoUploadSection
          onFileUpload={handleFileUpload}
          onPhotoTaken={handlePhotoTaken}
          isPhotoBooth={isPhotoBooth}
          setIsPhotoBooth={setIsPhotoBooth}
          isMobile={isMobile}
        />
        {!isSharedView && <ShareGalleryButton />}
      </div>

      {photos.length === 0 ? (
        <div className="col-span-full p-12 text-center bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
          <ImageIcon className="mx-auto h-16 w-16 text-violet-300" />
          <p className="mt-4 text-base text-gray-600">
            No photos yet. Start by taking or uploading photos!
          </p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex w-full -ml-1 -mr-1"
          columnClassName="pl-1 pr-1"
        >
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => openLightbox(index)}
              onDelete={(e) => handleDeletePhoto(e, photo)}
              isMobile={isMobile}
              hideDelete={isSharedView}
            />
          ))}
        </Masonry>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentPhotoIndex}
        slides={photos.map(photo => ({ src: photo.url }))}
      />
    </div>
  );
};