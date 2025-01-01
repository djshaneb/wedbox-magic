import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShareLinkInput } from "./ShareLinkInput";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ShareDialogProps {
  shareLink: string | null;
  onCopy: () => void;
}

export const ShareDialog = ({ shareLink, onCopy }: ShareDialogProps) => {
  const handleDownloadQR = () => {
    if (!shareLink) return;
    
    const svg = document.getElementById("share-qr-code");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = "wedding-gallery-qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
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
            <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl">
              <p className="text-sm font-medium text-gray-700">
                Scan QR Code to Access Gallery
              </p>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <QRCodeSVG
                  id="share-qr-code"
                  value={shareLink}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="w-full h-full"
                />
              </div>
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="gap-2 text-violet-600 border-violet-200 hover:bg-violet-50"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </Button>
              <p className="text-xs text-center text-gray-500 max-w-[250px]">
                Perfect for printing and displaying at your wedding venue!
              </p>
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};