import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const DeleteButton = ({ onClick }: DeleteButtonProps) => (
  <Button
    variant="destructive"
    size="icon"
    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white shadow-lg z-[9999]"
    onClick={onClick}
    type="button"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);