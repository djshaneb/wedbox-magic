import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsPhotoBooth(true);
      toast({
        title: "Camera started",
        description: "Photo booth mode is now active",
      });
    } catch (error) {
      toast({
        title: "Camera error",
        description: "Unable to access camera",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsPhotoBooth(false);
  };

  const takePhoto = () => {
    if (videoRef.current) {
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
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Photo
            </Button>
            <Button
              variant={isPhotoBooth ? "destructive" : "secondary"}
              onClick={isPhotoBooth ? stopCamera : startCamera}
            >
              <Camera className="mr-2 h-4 w-4" />
              {isPhotoBooth ? "Stop Camera" : "Photo Booth"}
            </Button>
          </div>

          {isPhotoBooth && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-xl mx-auto rounded-lg"
              />
              <Button
                onClick={takePhoto}
                className="mt-4"
                variant="secondary"
              >
                Take Photo
              </Button>
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