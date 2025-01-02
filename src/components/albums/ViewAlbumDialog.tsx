import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

      return photos || [];
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">{albumName}</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : !photos?.length ? (
          <div>No photos in this album yet</div>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </DialogContent>
    </Dialog>
  );
};