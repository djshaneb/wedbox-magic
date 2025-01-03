import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Image } from "lucide-react";
import { PhotoBooth } from "./PhotoBooth";
import { useState } from "react";

interface PhotoUploadSectionProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoTaken: (photoUrl: string) => void;
  isPhotoBooth: boolean;
  setIsPhotoBooth: (value: boolean) => void;
  isMobile: boolean;
}

export const PhotoUploadSection = ({
  onFileUpload,
  onPhotoTaken,
  isPhotoBooth,
  setIsPhotoBooth,
  isMobile
}: PhotoUploadSectionProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onPhotoTaken(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {isPhotoBooth && (
        <PhotoBooth
          onPhotoTaken={onPhotoTaken}
          onClose={() => setIsPhotoBooth(false)}
        />
      )}
      
      <div className="hidden">
        <Input
          type="file"
          accept="image/*"
          onChange={onFileUpload}
          className="hidden"
          id="photo-upload"
          multiple
        />
        {isMobile && (
          <Input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
            id="camera-capture"
          />
        )}
      </div>
    </>
  );
};