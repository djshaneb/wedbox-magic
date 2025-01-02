import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useAlbums } from "@/hooks/use-albums";
import { usePhotos } from "@/hooks/use-photos";
import { Check, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      // Get the current album to check if it's the Favorites album
      const { data: currentAlbum } = await supabase
        .from('albums')
        .select('name')
        .eq('id', albumId)
        .single();

      const isFavoritesAlbum = currentAlbum?.name === 'Favourites';
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      for (const photoId of selectedPhotos) {
        // Check if photo already exists in album using maybeSingle() instead of single()
        const { data: existingEntry } = await supabase
          .from('photo_albums')
          .select('*')
          .eq('photo_id', photoId)
          .eq('album_id', albumId)
          .maybeSingle();

        if (!existingEntry) {
          await addPhotoToAlbum.mutateAsync({ photoId, albumId });

          // If this is the Favorites album, automatically add a like
          if (isFavoritesAlbum) {
            // Check if like already exists
            const { data: existingLike } = await supabase
              .from('photo_likes')
              .select('*')
              .eq('photo_id', photoId)
              .eq('user_id', user.id)
              .maybeSingle();

            if (!existingLike) {
              await supabase
                .from('photo_likes')
                .upsert([{ photo_id: photoId, user_id: user.id }]);
            }
          }
        }
      }
      setOpen(false);
      setSelectedPhotos(new Set());
      toast({
        title: "Success",
        description: "Photos have been added to the album",
      });
    } catch (error) {
      console.error('Error adding photos to album:', error);
      toast({
        title: "Error",
        description: "Failed to add some photos to the album",
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
        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative cursor-pointer group"
                onClick={() => handleTogglePhoto(photo.id)}
              >
                <img
                  src={photo.thumbnail_url || photo.url}
                  alt="Gallery photo"
                  className={`w-full aspect-square object-cover rounded-lg transition-all duration-200 ${
                    selectedPhotos.has(photo.id) ? 'brightness-75' : 'group-hover:brightness-90'
                  }`}
                />
                {selectedPhotos.has(photo.id) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
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