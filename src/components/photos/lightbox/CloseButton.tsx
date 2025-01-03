import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CloseButtonProps {
  onClose: () => void;
}

export const CloseButton = ({ onClose }: CloseButtonProps) => (
  <Button
    key="close"
    variant="ghost"
    size="icon"
    className="text-white absolute top-4 right-4"
    onClick={onClose}
  >
    <X className="h-6 w-6" />
  </Button>
);