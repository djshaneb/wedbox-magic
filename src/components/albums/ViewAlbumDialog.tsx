import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { usePhotos } from "@/hooks/use-photos";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoLightbox } from "@/components/photos/PhotoLightbox";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isFavoritesAlbum = albumName === 'Favourites';
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { data: albumPhotos = [], isLoading } = useQuery({
    queryKey: ['album-photos', albumId],
    queryFn: async () => {
      const { data: photoAlbums, error: photoAlbumsError } = await supabase
        .from('photo_albums')
        .select('photo_id')
        .eq('album_id', albumId);

      if (photoAlbumsError) throw photoAlbumsError;
      if (!photoAlbums.length) return [];

      const photoIds = photoAlbums.map(pa => pa.photo_id);

      const { data: photos, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .in('id', photoIds);

      if (photosError) throw photosError;

      const photosWithUrls = await Promise.all(photos.map(async (photo) => {
        const { data: { publicUrl: url } } = supabase.storage
          .from('photos')
          .getPublicUrl(photo.storage_path);

        const { data: { publicUrl: thumbnailUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(photo.thumbnail_path);

        return {
          ...photo,
          url,
          thumbnail_url: thumbnailUrl
        };
      }));

      return photosWithUrls;
    }
  });

  const removePhotoMutation = useMutation({
    mutationFn: async ({ photoId }: { photoId: string }) => {
      // If it's the Favourites album, also remove the like
      if (isFavoritesAlbum) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        await supabase
          .from('photo_likes')
          .delete()
          .match({ photo_id: photoId, user_id: user.id });
      }

      const { error } = await supabase
        .from('photo_albums')
        .delete()
        .match({ photo_id: photoId, album_id: albumId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['album-photos', albumId] });
      setLightboxOpen(false);
      toast({
        title: "Photo removed",
        description: `Photo has been removed from ${albumName}`,
      });
    },
    onError: (error) => {
      console.error('Error removing photo:', error);
      toast({
        title: "Error",
        description: "Failed to remove photo from album",
        variant: "destructive",
      });
    }
  });

  const handleRemovePhoto = async (photoId: string) => {
    try {
      await removePhotoMutation.mutateAsync({ photoId });
    } catch (error) {
      console.error('Error removing photo:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{albumName}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
            </div>
          ) : albumPhotos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No photos in this album yet.</p>
          ) : (
            <>
              <PhotoGrid
                photos={albumPhotos}
                onPhotoClick={(index) => {
                  setCurrentPhotoIndex(index);
                  setLightboxOpen(true);
                }}
                isMobile={false}
              />
              {lightboxOpen && (
                <PhotoLightbox
                  isOpen={lightboxOpen}
                  onClose={() => setLightboxOpen(false)}
                  currentIndex={currentPhotoIndex}
                  photos={albumPhotos}
                  showRemoveButton={!isFavoritesAlbum}
                  onRemovePhoto={handleRemovePhoto}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};