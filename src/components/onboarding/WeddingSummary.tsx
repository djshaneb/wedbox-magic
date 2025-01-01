import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useState, useEffect } from "react";
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
  const [displayedNames, setDisplayedNames] = useState("");
  const [hasBeenEdited, setHasBeenEdited] = useState(false);

  useEffect(() => {
    if (!hasBeenEdited) {
      setDisplayedNames(`${firstName} & ${partnerName}`);
    }
  }, [firstName, partnerName, hasBeenEdited]);

  return (
    <div className="flex flex-col items-center space-y-8 max-w-md mx-auto">
      <WeddingImageSelector
        selectedImage={selectedImage}
        onImageSelect={onImageSelect}
        className="hover:scale-105 transition-transform duration-200"
      />

      <div className="w-full text-center">
        <EditableText
          text={displayedNames}
          onTextChange={(text) => {
            setHasBeenEdited(true);
            setDisplayedNames(text);
            onEditNames(text, "");
          }}
          className="text-2xl font-light text-wedding-pink"
        />
      </div>

      <div className="w-full text-center">
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <EditableText
                text={date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
                onTextChange={() => {}}
                className="text-lg text-gray-600"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onEditDate}
              initialFocus
              className="rounded-lg border-2"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full h-px bg-gray-100" />

      <div className="text-center space-y-6 text-gray-600 w-full">
        <EditableText
          text={welcomeText}
          onTextChange={setWelcomeText}
          className="text-lg"
        />
        <EditableText
          text={descriptionText}
          onTextChange={setDescriptionText}
          multiline
          className="text-sm leading-relaxed"
        />
      </div>
    </div>
  );
};