import { useState, useEffect, RefObject } from "react";
import { useToast } from "@/hooks/use-toast";

export const useCameraSetup = (videoRef: RefObject<HTMLVideoElement>) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setIsCameraReady(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (!videoRef.current) {
        throw new Error("Video element not initialized");
      }

      videoRef.current.srcObject = stream;
      
      await new Promise((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error("Video element not initialized"));
          return;
        }
        
        videoRef.current.onloadedmetadata = () => {
          if (!videoRef.current) {
            reject(new Error("Video element not initialized"));
            return;
          }
          videoRef.current.play()
            .then(() => {
              setIsCameraReady(true);
              resolve(true);
            })
            .catch(reject);
        };
      });

      toast({
        title: "Tap anywhere to take a photo",
        description: "A 5-second countdown will begin",
      });
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera error",
        description: error instanceof Error ? error.message : "Unable to access camera. Please ensure you have granted camera permissions.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  };

  return {
    isCameraReady,
    startCamera,
    stopCamera
  };
};