import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  text: string;
  onTextChange: (text: string) => void;
  multiline?: boolean;
  className?: string;
}

export const EditableText = ({ text, onTextChange, multiline = false, className }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleSubmit = () => {
    onTextChange(editedText);
    setIsEditing(false);
  };

  return (
    <div className="relative group">
      {isEditing ? (
        multiline ? (
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSubmit}
            className={cn("text-center min-h-[100px] focus:ring-wedding-pink/20", className)}
            autoFocus
          />
        ) : (
          <Input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSubmit}
            className={cn("text-center focus:ring-wedding-pink/20", className)}
            autoFocus
          />
        )
      ) : (
        <div className="flex items-center justify-center gap-2">
          <p className={cn(className)}>
            {text}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-wedding-pink/10 text-wedding-pink hover:bg-wedding-pink/20 hover:text-wedding-pink md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};