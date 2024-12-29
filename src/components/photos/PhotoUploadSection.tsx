import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Upload, Camera, Image } from "lucide-react";
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {isPhotoBooth && (
        <PhotoBooth
          onPhotoTaken={onPhotoTaken}
          onClose={() => setIsPhotoBooth(false)}
        />
      )}
      
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
        {/* Upload Photos Button */}
        <div className={`transform transition-all duration-300 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          <Input
            type="file"
            accept="image/*"
            onChange={onFileUpload}
            className="hidden"
            id="photo-upload"
            multiple
          />
          <Button
            onClick={() => {
              document.getElementById("photo-upload")?.click();
              setIsMenuOpen(false);
            }}
            size="lg"
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-48"
          >
            <Upload className="mr-2 h-5 w-5" /> Upload Photos
          </Button>
        </div>

        {/* Take Photo Button (Mobile Only) */}
        {isMobile && (
          <div className={`transform transition-all duration-300 delay-75 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
              id="camera-capture"
            />
            <Button
              onClick={() => {
                document.getElementById("camera-capture")?.click();
                setIsMenuOpen(false);
              }}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-48"
            >
              <Camera className="mr-2 h-5 w-5" /> Take Photo
            </Button>
          </div>
        )}

        {/* Photo Booth Mode Button */}
        <div className={`transform transition-all duration-300 delay-150 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          <Button
            onClick={() => {
              setIsPhotoBooth(!isPhotoBooth);
              setIsMenuOpen(false);
            }}
            size="lg"
            className={`${isPhotoBooth ? 
              "bg-red-500 hover:bg-red-600" : 
              "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            } text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-48`}
          >
            <Image className="mr-2 h-5 w-5" />
            {isPhotoBooth ? "Stop Camera" : "Photo Booth Mode"}
          </Button>
        </div>

        {/* Main FAB Button */}
        <Button
          onClick={toggleMenu}
          size="icon"
          className={`h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${isMenuOpen ? 'rotate-45' : ''}`}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
};