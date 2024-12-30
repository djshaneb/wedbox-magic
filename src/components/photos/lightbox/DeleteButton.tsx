import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const DeleteButton = ({ onClick }: DeleteButtonProps) => (
  <div className="absolute top-4 right-16 pointer-events-auto">
    <Button
      variant="destructive"
      size="icon"
      className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
      onClick={onClick}
      type="button"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);