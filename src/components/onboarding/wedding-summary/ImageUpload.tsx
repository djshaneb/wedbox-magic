import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useState } from "react";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
}

export const ImageUpload = ({ imagePreview, onImageChange }: ImageUploadProps) => {
  const optimizeImage = async (file: File): Promise<File> => {
    // Create a canvas to resize the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Create a promise to handle the image loading
    const loadImage = new Promise((resolve) => {
      img.onload = () => resolve(img);
      img.src = URL.createObjectURL(file);
    });

    await loadImage;

    // Calculate new dimensions (max 256px while maintaining aspect ratio)
    const maxSize = 256;
    let width = img.width;
    let height = img.height;

    if (width > height && width > maxSize) {
      height = (height * maxSize) / width;
      width = maxSize;
    } else if (height > maxSize) {
      width = (width * maxSize) / height;
      height = maxSize;
    }

    // Set canvas size and draw image
    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(img, 0, 0, width, height);

    // Convert to WebP
    const webpBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/webp', 0.8); // 0.8 quality gives good balance between size and quality
    });

    // Create a new file from the blob
    return new File([webpBlob], file.name.replace(/\.[^/.]+$/, '.webp'), {
      type: 'image/webp',
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const originalFile = event.target.files[0];
      try {
        const optimizedFile = await optimizeImage(originalFile);
        onImageChange(optimizedFile);
      } catch (error) {
        console.error('Error optimizing image:', error);
        // Fallback to original file if optimization fails
        onImageChange(originalFile);
      }
    }
  };

  return (
    <div className="relative w-full aspect-square max-w-[256px] rounded-lg overflow-hidden">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="image-upload"
      />
      {imagePreview ? (
        <div className="relative w-full h-full">
          <img
            src={imagePreview}
            alt="Wedding preview"
            className="w-full h-full object-cover"
            width={256}
            height={256}
            loading="lazy"
            decoding="async"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-wedding-pink transition-colors"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Upload wedding photo</span>
        </label>
      )}
    </div>
  );
};