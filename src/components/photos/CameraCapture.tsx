import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CameraControls } from "./camera/CameraControls";
import { useCameraControls } from "@/hooks/use-camera-controls";

interface CameraCaptureProps {
  onPhotoTaken: (photoUrl: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoTaken,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const {
    switchCamera,
  } = useCameraControls();

  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      setCapturedPhoto(canvas.toDataURL('image/jpeg'));
    }
  };

  const handleSave = () => {
    if (capturedPhoto) {
      onPhotoTaken(capturedPhoto);
      onClose();
    }
  };

  const handleDiscard = () => {
    setCapturedPhoto(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Button
        variant="ghost"
        className="absolute top-4 right-4 text-white z-10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {!capturedPhoto ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          <CameraControls
            onTakePhoto={takePhoto}
            onSwitchCamera={switchCamera}
          />
        </>
      ) : (
        <div className="relative h-full">
          <img 
            src={capturedPhoto} 
            alt="Captured photo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4">
            <Button
              variant="destructive"
              size="lg"
              onClick={handleDiscard}
              className="px-8"
            >
              Discard
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 px-8"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};