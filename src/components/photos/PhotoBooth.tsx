import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoBoothProps {
  onPhotoTaken: (photoUrl: string) => void;
  onClose: () => void;
}

export const PhotoBooth: React.FC<PhotoBoothProps> = ({
  onPhotoTaken,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraReady(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (!videoRef.current) {
        throw new Error("Video element not initialized");
      }

      videoRef.current.srcObject = stream;
      
      // Wait for the video to be loaded
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
        title: "Camera started",
        description: "Photo booth mode is now active",
      });
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera error",
        description: error instanceof Error ? error.message : "Unable to access camera. Please ensure you have granted camera permissions.",
        variant: "destructive",
      });
      onClose();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  };

  const takePhoto = () => {
    if (!videoRef.current || !isCameraReady) {
      toast({
        title: "Camera not ready",
        description: "Please wait for the camera to initialize",
        variant: "destructive",
      });
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      onPhotoTaken(canvas.toDataURL('image/jpeg'));
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-purple-50 to-blue-50 p-6 rounded-xl shadow-lg">
      <div className="relative aspect-video max-w-2xl mx-auto overflow-hidden rounded-lg border-4 border-white shadow-xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          onClick={takePhoto}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-2 rounded-full shadow-lg transform transition-all hover:scale-105"
          disabled={!isCameraReady}
        >
          Take Photo
        </Button>
      </div>
    </div>
  );
};