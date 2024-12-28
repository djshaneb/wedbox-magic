import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Camera, X } from "lucide-react";
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
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isCountingDown && countdown === 0) {
      takePhoto();
      setIsCountingDown(false);
      setCountdown(5);
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

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
        title: "Photo Booth Ready!",
        description: "Strike a pose and get ready for your photo!",
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

  const startCountdown = () => {
    setIsCountingDown(true);
    toast({
      title: "Get Ready!",
      description: "Photo will be taken in 5 seconds...",
    });
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
      toast({
        title: "Photo Captured!",
        description: "Looking good! 📸",
      });
    }
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
      
      <div className="relative h-full">
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

        {isCountingDown && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[200px] font-bold text-white animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <Button
            onClick={startCountdown}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg transform transition-all hover:scale-105 text-lg"
            disabled={!isCameraReady || isCountingDown}
          >
            <Camera className="mr-2 h-6 w-6" />
            Photo Booth Mode
          </Button>
        </div>
      </div>
    </div>
  );
};