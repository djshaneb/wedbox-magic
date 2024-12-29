import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShareLinkInput } from "./ShareLinkInput";

interface ShareDialogProps {
  shareLink: string | null;
  onCopy: () => void;
}

export const ShareDialog = ({ shareLink, onCopy }: ShareDialogProps) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Share Your Gallery
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share this link with your guests to let them view and contribute to your photo gallery!
          </p>
          <div className="flex items-center gap-2">
            <ShareLinkInput shareLink={shareLink} onCopy={onCopy} />
          </div>
        </div>
      </div>
    </DialogContent>
  );
};