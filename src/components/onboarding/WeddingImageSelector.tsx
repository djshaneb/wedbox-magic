import { cn } from "@/lib/utils";
import { ImageUpload } from "./wedding-summary/ImageUpload";

interface WeddingImageSelectorProps {
  selectedImage: string | null;
  onImageSelect: (url: string) => void;
  className?: string;
}

export const WeddingImageSelector = ({
  selectedImage,
  onImageSelect,
  className
}: WeddingImageSelectorProps) => {
  return (
    <div className={cn("flex justify-center", className)}>
      <ImageUpload
        imagePreview={selectedImage}
        onImageChange={(file) => {
          const url = URL.createObjectURL(file);
          onImageSelect(url);
        }}
      />
    </div>
  );
};