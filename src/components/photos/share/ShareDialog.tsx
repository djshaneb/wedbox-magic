import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShareLinkInput } from "./ShareLinkInput";

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shareLink: string | null;
  isLoading: boolean;
}

export const ShareDialog = ({
  isOpen,
  onOpenChange,
  shareLink,
  isLoading,
}: ShareDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share gallery</DialogTitle>
          <DialogDescription>
            Anyone with this link will be able to view your wedding photos.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <ShareLinkInput shareLink={shareLink} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
};