import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanLine } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useIsMobile } from "@/hooks/use-mobile";

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const startScanning = () => {
    setIsScanning(true);
  };

  const initializeScanner = async () => {
    if (!scannerRef.current && isScanning) {
      try {
        // Request camera permissions first
        await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Small delay to ensure DOM element exists
        setTimeout(() => {
          try {
            const qrboxSize = isMobile ? {
              width: window.innerWidth - 40,
              height: window.innerWidth - 40
            } : {
              width: 250,
              height: 250
            };

            scannerRef.current = new Html5QrcodeScanner(
              "qr-reader",
              { 
                fps: 10,
                qrbox: qrboxSize,
                rememberLastUsedCamera: true,
                supportedScanTypes: [],
                videoConstraints: {
                  facingMode: { ideal: "environment" },
                  aspectRatio: isMobile ? 4/3 : 16/9,
                }
              },
              /* verbose= */ false
            );

            scannerRef.current.render(
              (decodedText) => {
                handleQRCode(decodedText);
              },
              (error) => {
                console.error("QR Code scanning error:", error);
              }
            );
          } catch (error) {
            console.error("Error initializing scanner:", error);
            handleScannerError(error);
          }
        }, 100);
      } catch (error) {
        console.error("Camera access error:", error);
        handleScannerError(error);
      }
    }
  };

  const handleScannerError = (error: any) => {
    toast({
      title: "Camera Access Error",
      description: "Please ensure you have granted camera permissions and try again.",
      variant: "destructive"
    });
    setIsScanning(false);
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

  // Initialize scanner when dialog content is mounted and scanning is true
  React.useEffect(() => {
    if (isScanning) {
      initializeScanner();
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

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
      <DialogContent className={`sm:max-w-md ${isMobile ? 'h-[100dvh] w-screen p-0 mt-0' : ''}`}>
        <DialogHeader className={isMobile ? 'p-4' : ''}>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className={`relative overflow-hidden ${isMobile ? 'h-full' : 'aspect-video rounded-lg'}`}>
          <div id="qr-reader" className="w-full h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;