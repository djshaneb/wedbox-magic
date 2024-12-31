import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useState } from "react";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
}

export const ImageUpload = ({ imagePreview, onImageChange }: ImageUploadProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
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