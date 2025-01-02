import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePhotos } from "@/hooks/use-photos";
import { PhotoUploadSection } from "./PhotoUploadSection";
import { EmptyGallery } from "./EmptyGallery";
import { PhotoGrid } from "./PhotoGrid";
import { PhotoLightbox } from "./PhotoLightbox";
import { Photo } from "@/hooks/use-photos";
import { GalleryHeader } from "./gallery/GalleryHeader";
import { LoadingSpinner } from "../ui/loading-spinner";

interface PhotoGalleryProps {
  sharedGalleryOwnerId?: string;
  isSharedView?: boolean;
  isPhotoBooth?: boolean;
  setIsPhotoBooth?: (value: boolean) => void;
}

export const PhotoGallery = ({ 
  sharedGalleryOwnerId,
  isSharedView = false,
  isPhotoBooth = false,
  setIsPhotoBooth = () => {}
}: PhotoGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
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

  const handleDeletePhoto = async (photo: Photo) => {
    await deleteMutation.mutateAsync({ 
      id: photo.id, 
      storage_path: photo.storage_path 
    });
    setLightboxOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`space-y-2 max-w-7xl mx-auto px-4 md:px-6 ${isSharedView ? '-mt-2' : ''}`}>
      {!lightboxOpen && (
        <>
          <GalleryHeader 
            sharedGalleryOwnerId={sharedGalleryOwnerId}
            isSharedView={isSharedView}
          />
          <PhotoUploadSection
            onFileUpload={handleFileUpload}
            onPhotoTaken={handlePhotoTaken}
            isPhotoBooth={isPhotoBooth}
            setIsPhotoBooth={setIsPhotoBooth}
            isMobile={isMobile}
          />
        </>
      )}

      {photos.length === 0 ? (
        <EmptyGallery />
      ) : (
        <PhotoGrid
          photos={photos}
          onPhotoClick={(index) => {
            setCurrentPhotoIndex(index);
            setLightboxOpen(true);
          }}
          isMobile={isMobile}
          isSharedView={isSharedView}
        />
      )}

      <PhotoLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        currentIndex={currentPhotoIndex}
        photos={photos}
        onDelete={!isSharedView ? handleDeletePhoto : undefined}
        isSharedView={isSharedView}
      />
    </div>
  );
};