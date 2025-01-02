import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAlbums } from "@/hooks/use-albums";
import { usePhotos } from "@/hooks/use-photos";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PhotoSelectionGrid } from "./PhotoSelectionGrid";
import { checkExistingAlbumEntry, addPhotoLike } from "@/utils/albumOperations";

interface AddPhotosToAlbumDialogProps {
  albumId: string;
}

export const AddPhotosToAlbumDialog = ({ albumId }: AddPhotosToAlbumDialogProps) => {
  const [open, setOpen] = useState(false);
  const { photos } = usePhotos();
  const { addPhotoToAlbum } = useAlbums();
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleTogglePhoto = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleAddPhotos = async () => {
    try {
      const { data: currentAlbum, error: albumError } = await supabase
        .from('albums')
        .select('name')
        .eq('id', albumId)
        .maybeSingle();

      if (albumError) {
        console.error('Error fetching album:', albumError);
        throw albumError;
      }

      const isFavoritesAlbum = currentAlbum?.name === 'Favourites';
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let successCount = 0;
      const totalPhotos = selectedPhotos.size;

      for (const photoId of selectedPhotos) {
        try {
          const { data: existingEntry, error } = await checkExistingAlbumEntry(photoId, albumId);
          
          if (error) continue;

          if (!existingEntry) {
            await addPhotoToAlbum.mutateAsync({ photoId, albumId });

            if (isFavoritesAlbum) {
              await addPhotoLike(photoId, user.id);
            }
            successCount++;
          } else {
            console.log('Photo already exists in album:', photoId);
          }
        } catch (error) {
          console.error('Error processing photo:', photoId, error);
        }
      }

      setOpen(false);
      setSelectedPhotos(new Set());
      
      if (successCount === totalPhotos) {
        toast({
          title: "Success",
          description: "All photos have been added to the album",
        });
      } else if (successCount > 0) {
        toast({
          title: "Partial Success",
          description: `Added ${successCount} out of ${totalPhotos} photos to the album`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add photos to the album",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding photos to album:', error);
      toast({
        title: "Error",
        description: "Failed to add photos to the album",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Photos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Photos to Album</DialogTitle>
          <DialogDescription>
            Select photos to add to this album
          </DialogDescription>
        </DialogHeader>
        <PhotoSelectionGrid
          photos={photos}
          selectedPhotos={selectedPhotos}
          onTogglePhoto={handleTogglePhoto}
        />
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setOpen(false);
              setSelectedPhotos(new Set());
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddPhotos} 
            disabled={selectedPhotos.size === 0}
          >
            Add Selected Photos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};