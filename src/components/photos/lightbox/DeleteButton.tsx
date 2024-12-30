import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const DeleteButton = ({ onClick, className }: DeleteButtonProps) => (
  <Button
    variant="destructive"
    size="icon"
    className={`bg-red-500 hover:bg-red-600 text-white shadow-lg ${className}`}
    onClick={onClick}
    type="button"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);