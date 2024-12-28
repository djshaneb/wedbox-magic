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
    <Card className={`${isMobile ? 'shadow-none rounded-xl border-wedding-pink/20' : 'shadow-lg'} bg-white/80 backdrop-blur-sm transition-all duration-300`}>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
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
              className="flex-1 bg-gradient-to-r from-wedding-pink to-pink-400 hover:from-pink-500 hover:to-pink-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="mr-2 h-4 w-4 animate-bounce" /> Upload Photos
            </Button>
            <Button
              variant={isPhotoBooth ? "destructive" : "secondary"}
              onClick={() => setIsPhotoBooth(!isPhotoBooth)}
              className={`flex-1 ${isPhotoBooth ? 
                "bg-red-500 hover:bg-red-600 text-white" : 
                "bg-gradient-to-r from-violet-400 to-purple-400 hover:from-violet-500 hover:to-purple-500"} 
                text-white border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              <Camera className={`mr-2 h-4 w-4 ${!isPhotoBooth && 'animate-pulse'}`} />
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