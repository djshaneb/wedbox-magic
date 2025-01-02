import { useAlbums } from "@/hooks/use-albums";
import { CreateAlbumDialog } from "./CreateAlbumDialog";
import { AddPhotosToAlbumDialog } from "./AddPhotosToAlbumDialog";
import { Card } from "@/components/ui/card";
import { Folder } from "lucide-react";

export const AlbumList = () => {
  const { albums } = useAlbums();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CreateAlbumDialog />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album) => (
          <Card key={album.id} className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">{album.name}</h3>
            </div>
            {album.description && (
              <p className="text-sm text-gray-600">{album.description}</p>
            )}
            <AddPhotosToAlbumDialog albumId={album.id} />
          </Card>
        ))}
      </div>
    </div>
  );
};