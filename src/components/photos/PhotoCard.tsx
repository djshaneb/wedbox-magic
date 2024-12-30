import { Card } from "@/components/ui/card";
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
  isMobile,
  hideDelete = false 
}: PhotoCardProps) => {
  return (
    <Card 
      className={`mb-2 overflow-hidden ${
        isMobile ? 'shadow-none border-violet-200/20' : 'shadow-md'
      } cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={photo.url}
          alt="Gallery photo"
          className="w-full h-full object-cover aspect-square md:aspect-auto group-hover:brightness-105 transition-all duration-300"
        />
      </div>
    </Card>
  );
};