import { cn } from "@/lib/utils";

interface WeddingImageSelectorProps {
  selectedImage: string | null;
  onImageSelect: (url: string) => void;
  className?: string;
}

export const WeddingImageSelector = ({
  selectedImage,
  onImageSelect,
  className
}: WeddingImageSelectorProps) => {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <div
        onClick={() => onImageSelect("/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png")}
        className={`
          relative rounded-lg overflow-hidden cursor-pointer
          transition-all duration-200 transform hover:scale-105
          ${selectedImage === "/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png" ? 'ring-4 ring-wedding-pink' : 'ring-2 ring-gray-200'}
        `}
      >
        <div className="h-48 w-full bg-[url('/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png')] bg-[length:200%] bg-left bg-no-repeat" />
        {selectedImage === "/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png" && (
          <div className="absolute inset-0 bg-wedding-pink/20 flex items-center justify-center">
            <div className="bg-white rounded-full p-2">
              <svg
                className="w-6 h-6 text-wedding-pink"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div
        onClick={() => onImageSelect("/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png")}
        className={`
          relative rounded-lg overflow-hidden cursor-pointer
          transition-all duration-200 transform hover:scale-105
          ${selectedImage === "/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png" ? 'ring-4 ring-wedding-pink' : 'ring-2 ring-gray-200'}
        `}
      >
        <div className="h-48 w-full bg-[url('/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png')] bg-[length:200%] bg-right bg-no-repeat" />
        {selectedImage === "/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png" && (
          <div className="absolute inset-0 bg-wedding-pink/20 flex items-center justify-center">
            <div className="bg-white rounded-full p-2">
              <svg
                className="w-6 h-6 text-wedding-pink"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};