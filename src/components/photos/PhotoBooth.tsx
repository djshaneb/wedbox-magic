import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Camera, X, Check, X as XIcon } from "lucide-react";
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
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [reviewCountdown, setReviewCountdown] = useState(9);
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (capturedPhoto && reviewCountdown > 0) {
      timer = setTimeout(() => {
        setReviewCountdown(prev => prev - 1);
      }, 1000);
    } else if (capturedPhoto && reviewCountdown === 0) {
      handleSavePhoto();
    }
    return () => clearTimeout(timer);
  }, [capturedPhoto, reviewCountdown]);

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
    if (!isCountingDown && !capturedPhoto) {
      setIsCountingDown(true);
      toast({
        title: "Get Ready!",
        description: "Photo will be taken in 5 seconds...",
      });
    }
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
      setCapturedPhoto(canvas.toDataURL('image/jpeg'));
      setReviewCountdown(9);
      toast({
        title: "Review your photo",
        description: "Auto-saving in 9 seconds...",
      });
    }
  };

  const handleSavePhoto = () => {
    if (capturedPhoto) {
      onPhotoTaken(capturedPhoto);
      setCapturedPhoto(null);
      setReviewCountdown(9);
      toast({
        title: "Photo Saved!",
        description: "Looking good! 📸",
      });
    }
  };

  const handleDiscardPhoto = () => {
    setCapturedPhoto(null);
    setReviewCountdown(9);
    toast({
      title: "Photo Discarded",
      description: "Let's try again!",
    });
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
      
      <div className="relative h-full" onClick={startCountdown}>
        {!capturedPhoto ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={capturedPhoto} 
            alt="Captured photo" 
            className="w-full h-full object-cover"
          />
        )}
        
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

        {capturedPhoto && (
          <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-4">
            <div className="text-2xl font-bold text-white bg-black/50 px-6 py-2 rounded-full">
              Auto-saving in {reviewCountdown}s
            </div>
            <div className="flex gap-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDiscardPhoto();
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg"
              >
                <XIcon className="mr-2 h-6 w-6" />
                Discard
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSavePhoto();
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg"
              >
                <Check className="mr-2 h-6 w-6" />
                Save
              </Button>
            </div>
          </div>
        )}

        {isCameraReady && !isCountingDown && !capturedPhoto && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-bold text-white bg-black/50 px-6 py-2 rounded-full">
              Tap anywhere to start 5s countdown
            </div>
          </div>
        )}
      </div>
    </div>
  );
};