import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CameraView } from "./photo-booth/CameraView";
import { PhotoReview } from "./photo-booth/PhotoReview";
import { useCameraSetup } from "./photo-booth/useCameraSetup";
import { usePhotoCapture } from "./photo-booth/usePhotoCapture";

interface PhotoBoothProps {
  onPhotoTaken: (photoUrl: string) => void;
  onClose: () => void;
}

export const PhotoBooth: React.FC<PhotoBoothProps> = ({
  onPhotoTaken,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isCameraReady, startCamera, stopCamera } = useCameraSetup(videoRef);
  const {
    isCountingDown,
    countdown,
    capturedPhoto,
    reviewCountdown,
    startCountdown,
    handleSavePhoto,
    handleDiscardPhoto
  } = usePhotoCapture(videoRef, isCameraReady, onPhotoTaken, startCamera);

  React.useEffect(() => {
    const initCamera = async () => {
      await startCamera();
    };
    initCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      <Button
        variant="ghost"
        className="absolute top-4 right-4 text-white z-[10000]"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      
      <div className="relative flex-1 w-full h-full" onClick={startCountdown}>
        {!capturedPhoto ? (
          <CameraView
            videoRef={videoRef}
            isCameraReady={isCameraReady}
            isCountingDown={isCountingDown}
            countdown={countdown}
          />
        ) : (
          <PhotoReview
            photoUrl={capturedPhoto}
            reviewCountdown={reviewCountdown}
            onSave={handleSavePhoto}
            onDiscard={handleDiscardPhoto}
          />
        )}
      </div>
    </div>
  );
};