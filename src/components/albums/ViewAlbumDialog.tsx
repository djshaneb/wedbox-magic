import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Photo } from "@/hooks/use-photos";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  const { data: photos, isLoading } = useQuery({
    queryKey: ['album-photos', albumId],
    queryFn: async () => {
      const { data: photoAlbums } = await supabase
        .from('photo_albums')
        .select('photo_id')
        .eq('album_id', albumId);

      if (!photoAlbums?.length) return [];

      const photoIds = photoAlbums.map(pa => pa.photo_id);

      const { data: photos } = await supabase
        .from('photos')
        .select('*')
        .in('id', photoIds);

      if (!photos) return [];

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
    // You can add additional logic here if needed, like opening a lightbox
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
          <PhotoGrid 
            photos={photos} 
            onPhotoClick={handlePhotoClick}
            isMobile={isMobile}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};