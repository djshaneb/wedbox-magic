import { useAlbums, Album } from "@/hooks/use-albums";
import { CreateAlbumDialog } from "./CreateAlbumDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export const AlbumList = () => {
  const { albums, isLoading } = useAlbums();

  if (isLoading) {
    return <div>Loading albums...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Albums</h2>
        <CreateAlbumDialog />
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {albums.map((album: Album) => (
            <Card key={album.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{album.name}</CardTitle>
                <CardDescription>
                  Created {format(new Date(album.created_at), 'PPP')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {album.description || "No description"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};