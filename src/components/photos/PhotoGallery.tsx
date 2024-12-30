import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePhotos } from "@/hooks/use-photos";
import { PhotoUploadSection } from "./PhotoUploadSection";
import { ShareGalleryButton } from "./ShareGalleryButton";
import { EmptyGallery } from "./EmptyGallery";
import { PhotoGrid } from "./PhotoGrid";
import { PhotoLightbox } from "./PhotoLightbox";

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
    event.preventDefault();
    event.stopPropagation();
    
    try {
      await deleteMutation.mutateAsync({ 
        id: photo.id, 
        storage_path: photo.storage_path 
      });
      
      // Close lightbox if we're deleting the current photo
      if (lightboxOpen) {
        setLightboxOpen(false);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
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
      {!lightboxOpen && (
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
          onPhotoDelete={handleDeletePhoto}
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
      />
    </div>
  );
};