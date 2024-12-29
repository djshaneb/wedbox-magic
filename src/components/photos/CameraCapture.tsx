import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera, Flashlight, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onPhotoTaken: (photoUrl: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoTaken,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      // Try to turn on the flash if requested
      if (isFlashOn) {
        const track = newStream.getVideoTracks()[0];
        if (track.getCapabilities?.()?.torch) {
          await track.applyConstraints({
            advanced: [{ torch: true }]
          });
        }
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please ensure you have granted camera permissions.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const toggleFlash = async () => {
    if (!stream) return;
    
    const track = stream.getVideoTracks()[0];
    if (track.getCapabilities?.()?.torch) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !isFlashOn }]
        });
        setIsFlashOn(!isFlashOn);
      } catch (error) {
        toast({
          title: "Flash Error",
          description: "Unable to toggle flash. Your device may not support this feature.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Flash Not Available",
        description: "Your device does not support flash control.",
        variant: "destructive",
      });
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

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
          
          <div className="absolute bottom-8 inset-x-0 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              onClick={toggleFlash}
            >
              <Flashlight className={`h-6 w-6 ${isFlashOn ? 'text-yellow-400' : 'text-white'}`} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              onClick={takePhoto}
            >
              <Camera className="h-8 w-8 text-white" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              onClick={switchCamera}
            >
              <RotateCcw className="h-6 w-6 text-white" />
            </Button>
          </div>
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