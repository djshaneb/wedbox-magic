import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { PhotoLightbox } from "@/components/photos/PhotoLightbox";

interface ViewAlbumDialogProps {
  albumId: string;
  albumName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewAlbumDialog = ({ 
  albumId, 
  albumName,
  open,
  onOpenChange
}: ViewAlbumDialogProps) => {
  const isMobile = useIsMobile();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  const { data: photos, isLoading } = useQuery({
    queryKey: ['album-photos', albumId],
    queryFn: async () => {
      // First get the photo IDs from the photo_albums junction table
      const { data: photoAlbums, error: photoAlbumsError } = await supabase
        .from('photo_albums')
        .select('photo_id')
        .eq('album_id', albumId);

      if (photoAlbumsError) throw photoAlbumsError;
      if (!photoAlbums?.length) return [];

      const photoIds = photoAlbums.map(pa => pa.photo_id);

      // Then get the actual photos
      const { data: photos, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .in('id', photoIds);

      if (photosError) throw photosError;
      if (!photos) return [];

      // Transform the photos to include public URLs
      const photosWithUrls = await Promise.all(photos.map(async (photo) => {
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(photo.storage_path);
        
        const { data: { publicUrl: thumbnailUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(photo.thumbnail_path);
        
        return {
          id: photo.id,
          storage_path: photo.storage_path,
          url: publicUrl,
          thumbnail_url: thumbnailUrl
        };
      }));

      return photosWithUrls;
    },
  });

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">{albumName}</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : !photos?.length ? (
          <div>No photos in this album yet</div>
        ) : (
          <>
            <PhotoGrid 
              photos={photos} 
              onPhotoClick={handlePhotoClick}
              isMobile={isMobile}
            />
            <PhotoLightbox
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              currentIndex={selectedPhotoIndex}
              photos={photos}
              isSharedView={true} // This will disable likes functionality
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};