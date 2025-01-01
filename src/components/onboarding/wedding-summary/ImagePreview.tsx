import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ImagePreviewProps {
  imageUrl: string;
  isOptimizing: boolean;
  onEditClick: () => void;
}

export const ImagePreview = ({ imageUrl, isOptimizing, onEditClick }: ImagePreviewProps) => (
  <div className="relative w-full h-full">
    <img
      src={imageUrl}
      alt="Wedding preview"
      className={`w-full h-full object-cover transition-opacity duration-300 ${
        isOptimizing ? 'opacity-50' : 'opacity-100'
      }`}
      width={192}
      height={192}
      loading="lazy"
      decoding="async"
    />
    <Button
      variant="outline"
      size="icon"
      className="absolute top-2 right-2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
      onClick={onEditClick}
      disabled={isOptimizing}
    >
      <Camera className="h-4 w-4" />
    </Button>
    {isOptimizing && <LoadingSpinner />}
  </div>
);