import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X as XIcon } from "lucide-react";

interface PhotoReviewProps {
  photoUrl: string;
  reviewCountdown: number;
  onSave: () => void;
  onDiscard: () => void;
}

export const PhotoReview: React.FC<PhotoReviewProps> = ({
  photoUrl,
  reviewCountdown,
  onSave,
  onDiscard,
}) => {
  return (
    <>
      <img 
        src={photoUrl} 
        alt="Captured photo" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-4">
        <div className="text-2xl font-bold text-white bg-black/50 px-6 py-2 rounded-full">
          Auto-saving in {reviewCountdown}s
        </div>
        <div className="flex gap-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDiscard();
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg"
          >
            <XIcon className="mr-2 h-6 w-6" />
            Discard
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg"
          >
            <Check className="mr-2 h-6 w-6" />
            Save
          </Button>
        </div>
      </div>
    </>
  );
};