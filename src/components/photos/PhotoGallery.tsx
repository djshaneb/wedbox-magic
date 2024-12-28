import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PhotoBooth } from "./PhotoBooth";

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

  const handlePhotoTaken = (photoUrl: string, photoCaption: string) => {
    const newPhoto = {
      id: photos.length + 1,
      url: photoUrl,
      caption: photoCaption,
    };
    setPhotos([...photos, newPhoto]);
    setCaption("");
    toast({
      title: "Photo captured",
      description: "Your photo has been added to the gallery",
    });
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
              onClick={() => setIsPhotoBooth(!isPhotoBooth)}
              className={isPhotoBooth ? 
                "bg-red-100 hover:bg-red-200 text-red-700" : 
                "bg-blue-100 hover:bg-blue-200 text-blue-700"}
            >
              <Camera className="mr-2 h-4 w-4" />
              {isPhotoBooth ? "Stop Camera" : "Photo Booth"}
            </Button>
          </div>

          {isPhotoBooth && (
            <PhotoBooth
              onPhotoTaken={handlePhotoTaken}
              caption={caption}
              onClose={() => setIsPhotoBooth(false)}
            />
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