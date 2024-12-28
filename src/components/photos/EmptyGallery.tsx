import { ImageIcon } from "lucide-react";

export const EmptyGallery = () => (
  <div className="col-span-full p-12 text-center bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
    <ImageIcon className="mx-auto h-16 w-16 text-violet-300" />
    <p className="mt-4 text-base text-gray-600">
      No photos yet. Start by taking or uploading photos!
    </p>
  </div>
);