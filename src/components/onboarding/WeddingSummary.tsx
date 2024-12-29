import { Card } from "@/components/ui/card";
import { Pencil, Camera } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WeddingImageSelector } from "./WeddingImageSelector";

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
  const [isEditingWelcome, setIsEditingWelcome] = useState(false);
  const [welcomeText, setWelcomeText] = useState("Welcome to our special day,");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(
    "we're so excited to celebrate with you! Please use the Wedbox app to share your photos and videos with us, so that we get all the best memories from our special day."
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center space-y-8 max-w-md mx-auto">
      <div className="relative w-full">
        <WeddingImageSelector
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
          className="w-64 h-64 mx-auto"
        />
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

      <div className="text-center space-y-4 text-gray-600 w-full">
        <div className="relative">
          {isEditingWelcome ? (
            <Input
              value={welcomeText}
              onChange={(e) => setWelcomeText(e.target.value)}
              onBlur={() => setIsEditingWelcome(false)}
              className="text-lg text-center"
              autoFocus
            />
          ) : (
            <>
              <p className="text-lg" onClick={() => setIsEditingWelcome(true)}>
                {welcomeText}
              </p>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
                onClick={() => setIsEditingWelcome(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="relative">
          {isEditingDescription ? (
            <Textarea
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              onBlur={() => setIsEditingDescription(false)}
              className="text-center min-h-[100px]"
              autoFocus
            />
          ) : (
            <>
              <p onClick={() => setIsEditingDescription(true)}>
                {descriptionText}
              </p>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
                onClick={() => setIsEditingDescription(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};