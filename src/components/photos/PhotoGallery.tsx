import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePhotos } from "@/hooks/use-photos";
import { PhotoUploadSection } from "./PhotoUploadSection";
import { ShareGalleryButton } from "./ShareGalleryButton";
import { EmptyGallery } from "./EmptyGallery";
import { PhotoGrid } from "./PhotoGrid";
import { PhotoLightbox } from "./PhotoLightbox";
import { Photo } from "@/hooks/use-photos";
import { WeddingHeader } from "@/components/wedding/WeddingHeader";

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

  const handleDeletePhoto = async (photo: Photo) => {
    await deleteMutation.mutateAsync({ 
      id: photo.id, 
      storage_path: photo.storage_path 
    });
    setLightboxOpen(false);
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
        <div className={`flex flex-col gap-4 ${isMobile ? 'mt-16' : ''}`}>
          {isMobile && !isSharedView && (
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
              <WeddingHeader />
            </div>
          )}
          {!isSharedView && <ShareGalleryButton />}
          <PhotoUploadSection
            onFileUpload={handleFileUpload}
            onPhotoTaken={handlePhotoTaken}
            isPhotoBooth={isPhotoBooth}
            setIsPhotoBooth={setIsPhotoBooth}
            isMobile={isMobile}
          />
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