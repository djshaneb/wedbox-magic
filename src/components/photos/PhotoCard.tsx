import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Photo } from "@/hooks/use-photos";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onDelete: (event: React.MouseEvent) => void;
  isMobile: boolean;
  hideDelete?: boolean;
}

export const PhotoCard = ({ 
  photo, 
  onClick, 
  onDelete, 
  isMobile,
  hideDelete = false 
}: PhotoCardProps) => {
  return (
    <Card 
      className={`mb-2 overflow-hidden ${
        isMobile ? 'shadow-lg border-wedding-pink/20 w-full rounded-xl' : 'shadow-md'
      } cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group bg-white/80 backdrop-blur-sm`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={photo.url}
          alt="Gallery photo"
          className="w-full h-full object-cover group-hover:brightness-105 transition-all duration-300"
          loading="lazy"
        />
        {!hideDelete && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500/90 hover:bg-red-600 text-white shadow-lg backdrop-blur-sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};