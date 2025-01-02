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
import { Album } from "@/hooks/use-albums";
import { Check, FolderPlus } from "lucide-react";

interface AddToAlbumDialogProps {
  photoId: string;
}

export const AddToAlbumDialog = ({ photoId }: AddToAlbumDialogProps) => {
  const [open, setOpen] = useState(false);
  const { albums, addPhotoToAlbum } = useAlbums();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const handleAddToAlbum = async () => {
    if (!selectedAlbum) return;
    await addPhotoToAlbum.mutateAsync({ 
      photoId, 
      albumId: selectedAlbum.id 
    });
    setOpen(false);
    setSelectedAlbum(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute bottom-2 left-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
          <FolderPlus className="h-5 w-5 text-gray-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Album</DialogTitle>
          <DialogDescription>
            Select an album to add this photo to
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {albums.map((album) => (
              <Button
                key={album.id}
                variant="outline"
                className="w-full justify-between"
                onClick={() => setSelectedAlbum(album)}
              >
                {album.name}
                {selectedAlbum?.id === album.id && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleAddToAlbum} 
            disabled={!selectedAlbum}
          >
            Add to Album
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};