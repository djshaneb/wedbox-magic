import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Camera, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Photo {
  id: number;
  url: string;
  caption: string;
}

export const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [caption, setCaption] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPhotoBooth, setIsPhotoBooth] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (isPhotoBooth) {
        stopCamera();
      }
    };
  }, [isPhotoBooth]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: photos.length + 1,
          url: reader.result as string,
          caption: caption,
        };
        setPhotos([...photos, newPhoto]);
        setCaption("");
        toast({
          title: "Photo uploaded successfully",
          description: "Your photo has been added to the gallery",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraReady(false);
      
      // Request camera permissions and access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // Ensure video element exists
      if (!videoRef.current) {
        throw new Error("Video element not found");
      }

      // Set the stream as the video source
      videoRef.current.srcObject = stream;
      
      // Wait for the video to be loaded before playing
      videoRef.current.onloadedmetadata = async () => {
        try {
          if (videoRef.current) {
            await videoRef.current.play();
            setIsCameraReady(true);
            setIsPhotoBooth(true);
            toast({
              title: "Camera started",
              description: "Photo booth mode is now active",
            });
          }
        } catch (playError) {
          console.error("Error playing video:", playError);
          throw new Error("Failed to start video playback");
        }
      };
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera error",
        description: error instanceof Error ? error.message : "Unable to access camera. Please ensure you have granted camera permissions.",
        variant: "destructive",
      });
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsPhotoBooth(false);
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
      const newPhoto = {
        id: photos.length + 1,
        url: canvas.toDataURL('image/jpeg'),
        caption: caption,
      };
      setPhotos([...photos, newPhoto]);
      setCaption("");
      toast({
        title: "Photo captured",
        description: "Your photo has been added to the gallery",
      });
    }
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Add a caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex-1"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="photo-upload"
            />
            <Button
              onClick={() => document.getElementById("photo-upload")?.click()}
              variant="secondary"
              className="bg-purple-100 hover:bg-purple-200 text-purple-700"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Photo
            </Button>
            <Button
              variant={isPhotoBooth ? "destructive" : "secondary"}
              onClick={isPhotoBooth ? stopCamera : startCamera}
              className={isPhotoBooth ? 
                "bg-red-100 hover:bg-red-200 text-red-700" : 
                "bg-blue-100 hover:bg-blue-200 text-blue-700"}
            >
              <Camera className="mr-2 h-4 w-4" />
              {isPhotoBooth ? "Stop Camera" : "Photo Booth"}
            </Button>
          </div>

          {isPhotoBooth && (
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
          )}
        </div>
      </Card>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map((photo, index) => (
          <Card 
            key={photo.id} 
            className="break-inside-avoid mb-4 cursor-pointer transform transition-transform hover:scale-[1.02]"
            onClick={() => openLightbox(index)}
          >
            <div className="relative">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-auto"
              />
            </div>
            {photo.caption && (
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{photo.caption}</p>
              </div>
            )}
          </Card>
        ))}
        {photos.length === 0 && (
          <Card className="col-span-full p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No photos uploaded yet. Start sharing your wedding memories!
            </p>
          </Card>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentPhotoIndex}
        slides={photos.map(photo => ({ src: photo.url, alt: photo.caption }))}
      />
    </div>
  );
};