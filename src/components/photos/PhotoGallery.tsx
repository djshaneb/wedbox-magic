import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Camera, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PhotoBooth } from "./PhotoBooth";
import { useIsMobile } from "@/hooks/use-mobile";
import Masonry from 'react-masonry-css';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Photo {
  id: string;
  url: string;
  storage_path: string;
}

export const PhotoGallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPhotoBooth, setIsPhotoBooth] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Fetch photos from Supabase
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['photos'],
    queryFn: async () => {
      const { data: photos, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const photosWithUrls = await Promise.all(photos.map(async (photo) => {
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(photo.storage_path);
        
        return {
          id: photo.id,
          storage_path: photo.storage_path,
          url: publicUrl
        };
      }));

      return photosWithUrls;
    }
  });

  // Upload photo mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('photos')
        .insert({ storage_path: fileName });

      if (dbError) throw dbError;

      return fileName;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast({
        title: "Photo uploaded",
        description: "Your photo has been added to the gallery",
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo",
        variant: "destructive",
      });
    }
  });

  // Delete photo mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, storage_path }: { id: string, storage_path: string }) => {
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([storage_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast({
        title: "Photo deleted",
        description: "The photo has been removed from the gallery",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your photo",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    for (const file of fileArray) {
      await uploadMutation.mutateAsync(file);
    }
  };

  const handlePhotoTaken = async (photoUrl: string) => {
    // Convert base64 to blob
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    await uploadMutation.mutateAsync(file);
  };

  const handleDeletePhoto = async (event: React.MouseEvent, photo: Photo) => {
    event.stopPropagation();
    await deleteMutation.mutateAsync({ 
      id: photo.id, 
      storage_path: photo.storage_path 
    });
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const breakpointColumns = {
    default: 3,
    768: 2,
    500: 2
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

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
                className="flex-1 bg-gradient-to-r from-violet-500/90 to-purple-500/90 hover:from-violet-600 hover:to-purple-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Photos
              </Button>
              <Button
                variant={isPhotoBooth ? "destructive" : "secondary"}
                onClick={() => setIsPhotoBooth(!isPhotoBooth)}
                className={`flex-1 ${isPhotoBooth ? 
                  "bg-red-500 hover:bg-red-600 text-white border-none shadow-md" : 
                  "bg-gradient-to-r from-pink-500/90 to-rose-500/90 hover:from-pink-600 hover:to-rose-600 text-white border-none shadow-md hover:shadow-lg"} transition-all duration-300`}
              >
                <Camera className="mr-2 h-4 w-4" />
                {isPhotoBooth ? "Stop Camera" : "Photo Booth Mode"}
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
        <div className="col-span-full p-12 text-center bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
          <ImageIcon className="mx-auto h-16 w-16 text-violet-300" />
          <p className="mt-4 text-base text-gray-600">
            No photos yet. Start by taking or uploading photos!
          </p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex w-full -ml-1 -mr-1"
          columnClassName="pl-1 pr-1"
        >
          {photos.map((photo, index) => (
            <Card 
              key={photo.id} 
              className={`mb-2 overflow-hidden ${
                isMobile ? 'shadow-none border-violet-200/20 w-full' : 'shadow-md'
              } cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}
              onClick={() => openLightbox(index)}
            >
              <div className="relative">
                <img
                  src={photo.url}
                  alt="Gallery photo"
                  className="w-full h-full object-cover group-hover:brightness-105 transition-all duration-300"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white shadow-lg"
                  onClick={(e) => handleDeletePhoto(e, photo)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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