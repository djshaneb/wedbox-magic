import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: (event: React.MouseEvent) => void;
  className?: string;
}

export const DeleteButton = ({ onClick, className }: DeleteButtonProps) => (
  <Button
    variant="destructive"
    size="icon"
    className={className}
    onClick={onClick}
  >
    <Trash2 className="h-5 w-5" />
  </Button>
);