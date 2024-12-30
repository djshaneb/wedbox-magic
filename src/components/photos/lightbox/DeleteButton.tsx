import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const DeleteButton = ({ onClick }: DeleteButtonProps) => (
  <Button
    variant="destructive"
    size="icon"
    className="fixed bottom-8 right-8 z-[9999] bg-red-500 hover:bg-red-600 text-white shadow-lg"
    onClick={onClick}
    type="button"
  >
    <Trash2 className="h-6 w-6" />
  </Button>
);