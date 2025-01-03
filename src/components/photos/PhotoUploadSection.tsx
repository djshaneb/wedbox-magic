import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Image, Plus } from "lucide-react";
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
      
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size="icon"
          className={`relative h-14 w-14 rounded-full bg-gradient-to-r from-wedding-pink to-pink-400 hover:from-pink-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105 ${isMenuOpen ? 'rotate-45' : ''}`}
        >
          <Plus className={`h-6 w-6 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isMenuOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 space-y-2 min-w-[200px] animate-in fade-in slide-in-from-bottom-2">
            <Button
              onClick={() => {
                document.getElementById("photo-upload")?.click();
                setIsMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Photos
            </Button>
            
            {isMobile && (
              <Button
                onClick={() => {
                  document.getElementById("camera-capture")?.click();
                  setIsMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start"
              >
                <Camera className="mr-2 h-4 w-4" /> Take Photo
              </Button>
            )}

            <Button
              onClick={() => {
                setIsPhotoBooth(true);
                setIsMenuOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <Image className="mr-2 h-4 w-4" /> Photo Booth Mode
            </Button>
          </div>
        )}
      </div>

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