import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface EditableTextProps {
  text: string;
  onTextChange: (text: string) => void;
  multiline?: boolean;
}

export const EditableText = ({ text, onTextChange, multiline = false }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleSubmit = () => {
    onTextChange(editedText);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      {isEditing ? (
        multiline ? (
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSubmit}
            className="text-center min-h-[100px]"
            autoFocus
          />
        ) : (
          <Input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSubmit}
            className="text-lg text-center"
            autoFocus
          />
        )
      ) : (
        <>
          <p 
            className={multiline ? "" : "text-lg"} 
            onClick={() => setIsEditing(true)}
          >
            {text}
          </p>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-full bg-coral text-white hover:bg-coral/90 border-none"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};