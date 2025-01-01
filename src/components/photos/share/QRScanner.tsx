import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanLine } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startScanning = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          handleQRCode(decodedText);
        },
        (error) => {
          console.error("QR Code scanning error:", error);
        }
      );
    }
    setIsScanning(true);
  };

  const handleQRCode = (accessCode: string) => {
    // Clean up scanner
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);

    // Extract access code from URL if it's a full URL
    let code = accessCode;
    try {
      const url = new URL(accessCode);
      const pathParts = url.pathname.split('/');
      code = pathParts[pathParts.length - 1];
    } catch {
      // If it's not a URL, use the code as is
    }

    navigate(`/shared/${code}`);
    toast({
      title: "QR Code Scanned",
      description: "Redirecting to shared gallery..."
    });
  };

  const handleDialogClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <Dialog onOpenChange={(open) => {
      if (!open) {
        handleDialogClose();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" onClick={startScanning}>
          <ScanLine className="mr-2 h-4 w-4" />
          Scan QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <div id="qr-reader" className="w-full h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;