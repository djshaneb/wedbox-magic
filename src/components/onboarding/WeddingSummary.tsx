import { Card } from "@/components/ui/card";
import { Pencil, Camera } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface WeddingSummaryProps {
  firstName: string;
  partnerName: string;
  date: Date | undefined;
  onEditDate: () => void;
  onEditNames: () => void;
  onEditPhoto: () => void;
}

export const WeddingSummary = ({
  firstName,
  partnerName,
  date,
  onEditDate,
  onEditNames,
  onEditPhoto,
}: WeddingSummaryProps) => {
  return (
    <div className="flex flex-col items-center space-y-8 max-w-md mx-auto">
      <div className="relative w-full">
        <div className="w-64 h-64 mx-auto bg-[#A5C9C5] rounded-full flex items-center justify-center">
          <img
            src="/lovable-uploads/03c9a88a-9677-4417-9f21-2b802f9c7d78.png"
            alt="Wedding illustration"
            className="w-48 h-48 object-contain"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
          onClick={onEditPhoto}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full text-center relative">
        <h2 className="text-2xl font-light">
          {firstName} & {partnerName}
        </h2>
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
          onClick={onEditNames}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full text-center relative">
        <p className="text-xl font-light">
          {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
        </p>
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
          onClick={onEditDate}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full h-px bg-gray-200 my-8" />

      <div className="text-center space-y-4 text-gray-600">
        <p className="text-lg">Welcome to our special day,</p>
        <p>
          we're so excited to celebrate with you! Please use the Wedbox app to
          share your photos and videos with us, so that we get all the best
          memories from our special day.
        </p>
      </div>
    </div>
  );
};