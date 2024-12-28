import { useState, useEffect, RefObject } from "react";
import { useToast } from "@/hooks/use-toast";

export const usePhotoCapture = (
  videoRef: RefObject<HTMLVideoElement>,
  isCameraReady: boolean,
  onPhotoTaken: (photoUrl: string) => void
) => {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [reviewCountdown, setReviewCountdown] = useState(9);
  const { toast } = useToast();

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

  const startCountdown = () => {
    if (!isCountingDown && !capturedPhoto) {
      setIsCountingDown(true);
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
        duration: 2000,
      });
    }
  };

  const handleDiscardPhoto = () => {
    setCapturedPhoto(null);
    setReviewCountdown(9);
    // Reset countdown to ensure it's ready for the next photo
    setCountdown(5);
    setIsCountingDown(false);
    toast({
      title: "Photo Discarded",
      description: "Let's try again!",
      duration: 2000,
    });
  };

  return {
    isCountingDown,
    countdown,
    capturedPhoto,
    reviewCountdown,
    startCountdown,
    handleSavePhoto,
    handleDiscardPhoto
  };
};