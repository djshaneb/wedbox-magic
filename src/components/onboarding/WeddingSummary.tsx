import { Card } from "@/components/ui/card";
import { Pencil, Camera, Upload } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [isEditingWelcome, setIsEditingWelcome] = useState(false);
  const [welcomeText, setWelcomeText] = useState("Welcome to our special day,");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(
    "we're so excited to celebrate with you! Please use the Wedbox app to share your photos and videos with us, so that we get all the best memories from our special day."
  );
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(firstName);
  const [editedPartnerName, setEditedPartnerName] = useState(partnerName);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNamesSubmit = () => {
    onEditNames(editedFirstName, editedPartnerName);
    setIsEditingNames(false);
  };

  return (
    <div className="flex flex-col items-center space-y-8 max-w-md mx-auto">
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
              className="w-full h-full object-cover"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
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

      <div className="w-full text-center relative">
        {isEditingNames ? (
          <div className="space-y-2">
            <Input
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              className="text-center"
              placeholder="Your name"
            />
            <Input
              value={editedPartnerName}
              onChange={(e) => setEditedPartnerName(e.target.value)}
              className="text-center"
              placeholder="Partner's name"
            />
            <Button onClick={handleNamesSubmit} className="mt-2">
              Save Names
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-light">
              {firstName} & {partnerName}
            </h2>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
              onClick={() => setIsEditingNames(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="w-full text-center relative">
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <p className="text-xl font-light">
                {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
              </p>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
              >
                <Pencil className="h-4 w-4" />
              </Button>
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