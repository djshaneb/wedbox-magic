import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDeleting(true);
    try {
      await onClick(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      className="fixed bottom-8 right-8 z-[9999] bg-red-500 hover:bg-red-600 text-white shadow-lg rounded-full h-14 w-14 transition-all duration-200 hover:scale-105"
      onClick={handleClick}
      type="button"
      disabled={isDeleting}
    >
      <Trash2 className={`h-6 w-6 ${isDeleting ? 'animate-spin' : ''}`} />
    </Button>
  );
};