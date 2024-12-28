import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PhotoBooth } from "./PhotoBooth";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map((file) => {
      return new Promise<Photo>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: Date.now() + Math.random(),
            url: reader.result as string,
            caption: caption,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newPhotos = await Promise.all(uploadPromises);
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    setCaption("");

    toast({
      title: `${newPhotos.length} ${newPhotos.length === 1 ? 'photo' : 'photos'} uploaded`,
      description: "Your photos have been added to the gallery",
    });
  };

  const handlePhotoTaken = (photoUrl: string, photoCaption: string) => {
    const newPhoto = {
      id: Date.now() + Math.random(),
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
    <div className="space-y-4">
      <Card className={`${isMobile ? 'shadow-none rounded-none border-0 border-b' : 'shadow-sm'} bg-white`}>
        <div className="p-4 space-y-4">
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="Add a caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="photo-upload"
                multiple
              />
              <Button
                onClick={() => document.getElementById("photo-upload")?.click()}
                variant="secondary"
                className="flex-1 bg-wedding-pink/10 hover:bg-wedding-pink/20 text-wedding-pink"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Photos
              </Button>
              <Button
                variant={isPhotoBooth ? "destructive" : "secondary"}
                onClick={() => setIsPhotoBooth(!isPhotoBooth)}
                className={`flex-1 ${isPhotoBooth ? 
                  "bg-red-50 hover:bg-red-100 text-red-700" : 
                  "bg-wedding-pink/10 hover:bg-wedding-pink/20 text-wedding-pink"}`}
              >
                <Camera className="mr-2 h-4 w-4" />
                {isPhotoBooth ? "Stop Camera" : "Take Photo"}
              </Button>
            </div>
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

      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
        {photos.map((photo, index) => (
          <Card 
            key={photo.id} 
            className={`overflow-hidden ${isMobile ? 'shadow-none border-wedding-pink/20' : 'shadow-sm'} cursor-pointer transform transition-transform hover:scale-[1.02]`}
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-square">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover"
              />
            </div>
            {photo.caption && (
              <div className="p-2">
                <p className="text-xs text-wedding-pink/80 truncate">{photo.caption}</p>
              </div>
            )}
          </Card>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-wedding-pink opacity-50" />
            <p className="mt-2 text-sm text-wedding-pink/80">
              No photos yet. Start by taking or uploading photos!
            </p>
          </div>
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