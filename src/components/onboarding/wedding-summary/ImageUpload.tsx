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
      new URL('../../../workers/imageOptimizer.ts', import.meta.url),
      { type: 'module' }
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const optimizeImage = async (file: File): Promise<File> => {
    if (!workerRef.current) {
      throw new Error('Worker not initialized');
    }

    return new Promise((resolve, reject) => {
      const worker = workerRef.current!;

      worker.onmessage = (e) => {
        if (e.data.success) {
          const { blob, type } = e.data.result;
          resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), { type }));
        } else {
          reject(new Error(e.data.error));
        }
      };

      worker.onerror = (error) => {
        reject(error);
      };

      const reader = new FileReader();
      reader.onload = () => {
        worker.postMessage({
          imageData: reader.result,
          fileName: file.name
        });
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
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
    <div className="relative w-full aspect-square max-w-[192px] rounded-lg overflow-hidden">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id={INPUT_ID}
      />
      {imagePreview ? (
        <ImagePreview
          imageUrl={imagePreview}
          isOptimizing={isOptimizing}
          onEditClick={() => document.getElementById(INPUT_ID)?.click()}
        />
      ) : (
        <EmptyImageUpload inputId={INPUT_ID} />
      )}
    </div>
  );
};