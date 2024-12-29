import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import { EditableText } from "./wedding-summary/EditableText";
import { ImageUpload } from "./wedding-summary/ImageUpload";

interface WeddingSummaryProps {
  firstName: string;
  partnerName: string;
  date: Date | undefined;
  onEditDate: (date: Date | undefined) => void;
  onEditNames: (firstName: string, partnerName: string) => void;
}

export const WeddingSummary = ({
  firstName,
  partnerName,
  date,
  onEditDate,
  onEditNames,
}: WeddingSummaryProps) => {
  const [welcomeText, setWelcomeText] = useState("Welcome to our special day,");
  const [descriptionText, setDescriptionText] = useState(
    "we're so excited to celebrate with you! Please use the Wedbox app to share your photos and videos with us, so that we get all the best memories from our special day."
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center space-y-8 max-w-md mx-auto">
      <ImageUpload
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
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

      <div className="w-full h-px bg-gray-200 my-8" />

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