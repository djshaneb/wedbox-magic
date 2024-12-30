import { Card } from "@/components/ui/card";
import { Photo } from "@/hooks/use-photos";
import { DeleteButton } from "./lightbox/DeleteButton";

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
        isMobile ? 'shadow-none border-violet-200/20' : 'shadow-md'
      } cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group relative`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={photo.url}
          alt="Gallery photo"
          className="w-full h-full object-cover aspect-square md:aspect-auto group-hover:brightness-105 transition-all duration-300"
        />
        {!hideDelete && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DeleteButton onClick={onDelete} />
          </div>
        )}
      </div>
    </Card>
  );
};