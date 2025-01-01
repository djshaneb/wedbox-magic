import { useState, useRef, useEffect } from "react";
import { EmptyImageUpload } from "./EmptyImageUpload";
import { ImagePreview } from "./ImagePreview";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
}

export const ImageUpload = ({ imagePreview, onImageChange }: ImageUploadProps) => {
  const workerRef = useRef<Worker | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const INPUT_ID = "image-upload";

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../../workers/imageOptimizer.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (event) => {
      const { optimizedBlob } = event.data;
      if (optimizedBlob) {
        const file = new File([optimizedBlob], "optimized-image.jpg", {
          type: "image/jpeg",
        });
        onImageChange(file);
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [onImageChange]);

  const optimizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error("Worker not initialized"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          workerRef.current?.postMessage({
            imageData: reader.result,
            maxWidth: 1920,
            quality: 0.8,
          });
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      setIsOptimizing(true);
      
      try {
        const optimizedFile = await optimizeImage(file);
        onImageChange(optimizedFile);
      } catch (error) {
        console.error('Error optimizing image:', error);
        toast({
          title: "Error processing image",
          description: "Please try again with a different image",
          variant: "destructive",
        });
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  return (
    <div className="relative w-64 h-64 mx-auto rounded-lg overflow-hidden">
      <input
        type="file"
        id={INPUT_ID}
        className="hidden"
        onChange={handleImageChange}
        accept="image/*"
      />
      {imagePreview ? (
        <ImagePreview
          imageUrl={imagePreview}
          isOptimizing={isOptimizing}
          onEditClick={() => {
            const input = document.getElementById(INPUT_ID) as HTMLInputElement;
            input?.click();
          }}
        />
      ) : (
        <EmptyImageUpload inputId={INPUT_ID} />
      )}
    </div>
  );
};