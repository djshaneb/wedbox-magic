import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Camera } from "lucide-react";
import { PhotoBooth } from "./PhotoBooth";

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
  return (
    <Card className={`${isMobile ? 'shadow-none rounded-none border-0 border-b' : 'shadow-sm'} bg-white`}>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-3">
          <div className={`flex ${isMobile ? 'flex-col' : ''} gap-2`}>
            <Input
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              className="hidden"
              id="photo-upload"
              multiple
            />
            <Button
              onClick={() => document.getElementById("photo-upload")?.click()}
              variant="secondary"
              size={isMobile ? "sm" : "default"}
              className={`${isMobile ? 'w-full' : 'flex-1'} bg-gradient-to-r from-violet-500/90 to-purple-500/90 hover:from-violet-600 hover:to-purple-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Photos
            </Button>
            <Button
              variant={isPhotoBooth ? "destructive" : "secondary"}
              size={isMobile ? "sm" : "default"}
              onClick={() => setIsPhotoBooth(!isPhotoBooth)}
              className={`${isMobile ? 'w-full' : 'flex-1'} ${isPhotoBooth ? 
                "bg-red-500 hover:bg-red-600 text-white border-none shadow-md" : 
                "bg-gradient-to-r from-pink-500/90 to-rose-500/90 hover:from-pink-600 hover:to-rose-600 text-white border-none shadow-md hover:shadow-lg"} transition-all duration-300`}
            >
              <Camera className="mr-2 h-4 w-4" />
              {isPhotoBooth ? "Stop Camera" : "Photo Booth Mode"}
            </Button>
          </div>

          {isPhotoBooth && (
            <PhotoBooth
              onPhotoTaken={onPhotoTaken}
              onClose={() => setIsPhotoBooth(false)}
            />
          )}
        </div>
      </div>
    </Card>
  );
};