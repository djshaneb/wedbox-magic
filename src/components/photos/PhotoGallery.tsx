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
import Masonry from 'react-masonry-css';

interface Photo {
  id: number;
  url: string;
}

export const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
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
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newPhotos = await Promise.all(uploadPromises);
    setPhotos((prevPhotos) => [...newPhotos, ...prevPhotos]);

    toast({
      title: `${newPhotos.length} ${newPhotos.length === 1 ? 'photo' : 'photos'} uploaded`,
      description: "Your photos have been added to the gallery",
    });
  };

  const handlePhotoTaken = (photoUrl: string) => {
    const newPhoto = {
      id: Date.now() + Math.random(),
      url: photoUrl,
    };
    setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
    toast({
      title: "Photo captured",
      description: "Your photo has been added to the gallery",
    });
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const breakpointColumns = {
    default: 3,
    768: 2,
    500: 3
  };

  return (
    <div className="space-y-4">
      <Card className={`${isMobile ? 'shadow-none rounded-none border-0 border-b' : 'shadow-sm'} bg-white`}>
        <div className="p-4 space-y-4">
          <div className="flex flex-col gap-3">
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
                className="flex-1 bg-gradient-to-r from-wedding-pink/10 to-pink-200/20 hover:from-wedding-pink/20 hover:to-pink-200/30 text-wedding-pink border border-wedding-pink/20"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Photos
              </Button>
              <Button
                variant={isPhotoBooth ? "destructive" : "secondary"}
                onClick={() => setIsPhotoBooth(!isPhotoBooth)}
                className={`flex-1 ${isPhotoBooth ? 
                  "bg-red-50 hover:bg-red-100 text-red-700 border-red-200" : 
                  "bg-gradient-to-r from-pink-100/50 to-purple-100/50 hover:from-pink-100/70 hover:to-purple-100/70 text-gray-700 border border-pink-200/30"}`}
              >
                <Camera className="mr-2 h-4 w-4" />
                {isPhotoBooth ? "Stop Camera" : "Take Photo"}
              </Button>
            </div>

            {isPhotoBooth && (
              <PhotoBooth
                onPhotoTaken={handlePhotoTaken}
                onClose={() => setIsPhotoBooth(false)}
              />
            )}
          </div>
        </div>
      </Card>

      {photos.length === 0 ? (
        <div className="col-span-full p-12 text-center bg-gradient-to-r from-pink-50/50 to-purple-50/50 rounded-lg border border-wedding-pink/10">
          <ImageIcon className="mx-auto h-16 w-16 text-wedding-pink/40" />
          <p className="mt-4 text-base text-gray-600">
            No photos yet. Start by taking or uploading photos!
          </p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex w-full gap-2"
          columnClassName="masonry-grid_column"
        >
          {photos.map((photo, index) => (
            <Card 
              key={photo.id} 
              className={`mb-2 overflow-hidden ${
                isMobile ? 'shadow-none border-wedding-pink/20 w-full' : 'shadow-md'
              } cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}
              onClick={() => openLightbox(index)}
            >
              <div className={`relative ${isMobile ? 'h-[250px]' : 'h-auto'}`}>
                <img
                  src={photo.url}
                  alt="Uploaded photo"
                  className="w-full h-full object-cover group-hover:brightness-105 transition-all duration-300"
                />
              </div>
            </Card>
          ))}
        </Masonry>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentPhotoIndex}
        slides={photos.map(photo => ({ src: photo.url }))}
      />
    </div>
  );
};