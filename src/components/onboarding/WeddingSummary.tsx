import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import { EditableText } from "./wedding-summary/EditableText";
import { WeddingImageSelector } from "./WeddingImageSelector";

interface WeddingSummaryProps {
  firstName: string;
  partnerName: string;
  date: Date | undefined;
  onEditDate: (date: Date | undefined) => void;
  onEditNames: (firstName: string, partnerName: string) => void;
  selectedImage: string | null;
  onImageSelect: (url: string) => void;
}

export const WeddingSummary = ({
  firstName,
  partnerName,
  date,
  onEditDate,
  onEditNames,
  selectedImage,
  onImageSelect,
}: WeddingSummaryProps) => {
  const [welcomeText, setWelcomeText] = useState("Welcome to our special day,");
  const [descriptionText, setDescriptionText] = useState(
    "we're so excited to celebrate with you! Please use the WeddingWin Photo App to share your photos and videos with us, so that we get all the best memories from our special day."
  );

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
      <WeddingImageSelector
        selectedImage={selectedImage}
        onImageSelect={onImageSelect}
      />

      <div className="w-full text-center relative">
        <EditableText
          text={firstName && partnerName ? `${firstName} & ${partnerName}` : firstName || ""}
          onTextChange={(text) => onEditNames(text, "")}
        />
      </div>

      <div className="w-full text-center relative">
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <EditableText
                text={date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
                onTextChange={() => {}}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onEditDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="text-center space-y-4 text-gray-600 w-full">
        <EditableText
          text={welcomeText}
          onTextChange={setWelcomeText}
        />
        <EditableText
          text={descriptionText}
          onTextChange={setDescriptionText}
          multiline
        />
      </div>
    </div>
  );
};