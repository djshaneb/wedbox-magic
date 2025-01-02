import { Photo } from "@/hooks/use-photos";
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhotoSelectionGridProps {
  photos: Photo[];
  selectedPhotos: Set<string>;
  onTogglePhoto: (photoId: string) => void;
}

export const PhotoSelectionGrid = ({ 
  photos, 
  selectedPhotos, 
  onTogglePhoto 
}: PhotoSelectionGridProps) => {
  return (
    <ScrollArea className="h-[500px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative cursor-pointer group"
            onClick={() => onTogglePhoto(photo.id)}
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
  );
};