import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const DeleteButton = ({ onClick }: DeleteButtonProps) => (
  <Button
    variant="destructive"
    size="icon"
    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999999] bg-red-500 hover:bg-red-600 text-white shadow-lg md:left-8 md:translate-x-0 h-12 w-12"
    onClick={onClick}
    type="button"
  >
    <Trash2 className="h-6 w-6" />
  </Button>
);