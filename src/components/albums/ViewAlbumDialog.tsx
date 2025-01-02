import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Photo } from "@/hooks/use-photos";
import { LoadingSpinner } from "../ui/loading-spinner";

interface ViewAlbumDialogProps {
  albumId: string;
  albumName: string;
}

export const ViewAlbumDialog = ({ albumId, albumName }: ViewAlbumDialogProps) => {
  const [open, setOpen] = useState(false);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['album-photos', albumId],
    queryFn: async () => {
      const { data: photoAlbums, error: photoAlbumsError } = await supabase
        .from('photo_albums')
        .select('photo_id')
        .eq('album_id', albumId);

      if (photoAlbumsError) throw photoAlbumsError;

      const photoIds = photoAlbums.map(pa => pa.photo_id);

      if (photoIds.length === 0) return [];

      const { data: photos, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .in('id', photoIds);

      if (photosError) throw photosError;

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
    enabled: open
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full mt-2">
          View Photos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{albumName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : photos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No photos in this album yet
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
              {photos.map((photo: Photo) => (
                <div key={photo.id} className="relative aspect-square">
                  <img
                    src={photo.thumbnail_url || photo.url}
                    alt="Album photo"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};