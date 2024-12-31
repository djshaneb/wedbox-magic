import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
}

export const ImageUpload = ({ imagePreview, onImageChange }: ImageUploadProps) => {
  const workerRef = useRef<Worker | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Initialize the worker
    workerRef.current = new Worker(
      new URL('../../../workers/imageOptimizer.ts', import.meta.url),
      { type: 'module' }
    );

    // Clean up worker on unmount
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

      // Read file as ArrayBuffer to send to worker
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
      const originalFile = event.target.files[0];
      setIsOptimizing(true);
      
      try {
        const optimizedFile = await optimizeImage(originalFile);
        onImageChange(optimizedFile);
      } catch (error) {
        console.error('Error optimizing image:', error);
        // Fallback to original file if optimization fails
        onImageChange(originalFile);
      } finally {
        setIsOptimizing(false);
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
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isOptimizing ? 'opacity-50' : 'opacity-100'
            }`}
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
            disabled={isOptimizing}
          >
            <Camera className="h-4 w-4" />
          </Button>
          {isOptimizing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
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