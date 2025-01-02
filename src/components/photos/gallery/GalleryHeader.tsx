import { ShareGalleryButton } from "../ShareGalleryButton";
import { WeddingHeader } from "@/components/wedding/WeddingHeader";

interface GalleryHeaderProps {
  sharedGalleryOwnerId?: string;
  isSharedView: boolean;
}

export const GalleryHeader = ({ sharedGalleryOwnerId, isSharedView }: GalleryHeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        <WeddingHeader sharedGalleryOwnerId={sharedGalleryOwnerId} />
      </div>
      {!isSharedView && (
        <div className="w-full max-w-3xl mx-auto">
          <ShareGalleryButton />
        </div>
      )}
    </div>
  );
};