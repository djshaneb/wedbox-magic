import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShareLinkInput } from "./ShareLinkInput";
import QRCode from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  shareLink: string | null;
  onCopy: () => void;
}

export const ShareDialog = ({ shareLink, onCopy }: ShareDialogProps) => {
  const { toast } = useToast();

  const handleDownloadQR = () => {
    if (!shareLink) return;

    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "wedding-gallery-qr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast({
      title: "QR Code downloaded!",
      description: "You can now print and share the QR code with your guests.",
    });
  };

  return (
    <DialogContent className="sm:max-w-md mt-16 sm:mt-0">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Share Your Gallery
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share this link with your guests to let them view and contribute to your photo gallery!
          </p>
          <div className="flex items-center gap-2">
            <ShareLinkInput shareLink={shareLink} onCopy={onCopy} />
          </div>
          
          {shareLink && (
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <QRCode
                  id="qr-code"
                  value={shareLink}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <Button
                onClick={handleDownloadQR}
                className="w-full sm:w-auto flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};