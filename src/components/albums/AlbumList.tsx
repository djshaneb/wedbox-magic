import { useAlbums } from "@/hooks/use-albums";
import { CreateAlbumDialog } from "./CreateAlbumDialog";
import { AddPhotosToAlbumDialog } from "./AddPhotosToAlbumDialog";
import { ViewAlbumDialog } from "./ViewAlbumDialog";
import { Card } from "@/components/ui/card";
import { Folder, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const useAlbumThumbnails = (albumId: string) => {
  return useQuery({
    queryKey: ['album-thumbnails', albumId],
    queryFn: async () => {
      const { data: photoAlbums, error: photoAlbumsError } = await supabase
        .from('photo_albums')
        .select('photo_id')
        .eq('album_id', albumId)
        .limit(4);

      if (photoAlbumsError) throw photoAlbumsError;
      if (!photoAlbums.length) return [];

      const photoIds = photoAlbums.map(pa => pa.photo_id);

      const { data: photos, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .in('id', photoIds);

      if (photosError) throw photosError;

      const photosWithUrls = await Promise.all(photos.map(async (photo) => {
        const { data: { publicUrl: thumbnailUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(photo.thumbnail_path);
        
        return thumbnailUrl;
      }));

      return photosWithUrls;
    }
  });
};

export const AlbumList = () => {
  const { albums } = useAlbums();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Your Albums</h2>
        <CreateAlbumDialog />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {albums.map((album) => {
          const { data: thumbnails = [] } = useAlbumThumbnails(album.id);
          
          return (
            <Card key={album.id} className="p-4 space-y-4 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium truncate">{album.name}</h3>
              </div>
              
              {album.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{album.description}</p>
              )}

              {thumbnails.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 aspect-square">
                  {thumbnails.map((url, index) => (
                    <div 
                      key={index}
                      className={`relative bg-gray-100 rounded-lg overflow-hidden ${
                        index === 3 && thumbnails.length > 4 ? 'relative' : ''
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Album thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 3 && thumbnails.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-medium">+{thumbnails.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <div className="space-y-2 pt-2">
                <AddPhotosToAlbumDialog albumId={album.id} />
                <ViewAlbumDialog albumId={album.id} albumName={album.name} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};