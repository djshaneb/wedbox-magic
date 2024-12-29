import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ExtendedMediaStreamTrack } from "@/types/camera";

export const useCameraControls = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
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

      // Try to turn on the flash if requested
      if (isFlashOn) {
        const track = newStream.getVideoTracks()[0] as ExtendedMediaStreamTrack;
        const capabilities = track.getCapabilities();
        if (capabilities?.torch) {
          await track.applyConstraints({
            advanced: [{ torch: true }]
          });
        }
      }

      return newStream;
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please ensure you have granted camera permissions.",
        variant: "destructive",
      });
      return null;
    }
  };

  const toggleFlash = async () => {
    if (!stream) return;
    
    const track = stream.getVideoTracks()[0] as ExtendedMediaStreamTrack;
    const capabilities = track.getCapabilities();
    
    if (capabilities?.torch) {
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

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  return {
    stream,
    isFlashOn,
    facingMode,
    toggleFlash,
    switchCamera,
    startCamera
  };
};