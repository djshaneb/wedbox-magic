import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanLine } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        
        // Create a canvas to capture video frames
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Start scanning frames
        const scanFrame = () => {
          if (!isScanning) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          
          if (videoRef.current && context) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            // Here you would typically use a QR code detection library
            // For now, we'll simulate finding a code after 3 seconds
            setTimeout(() => {
              handleQRCode("example-access-code");
            }, 3000);
          }
          
          requestAnimationFrame(scanFrame);
        };
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          scanFrame();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please make sure you've granted camera permissions.",
        variant: "destructive"
      });
    }
  };

  const handleQRCode = (accessCode: string) => {
    setIsScanning(false);
    if (videoRef.current?.srcObject instanceof MediaStream) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    navigate(`/shared/${accessCode}`);
    toast({
      title: "QR Code Scanned",
      description: "Redirecting to shared gallery..."
    });
  };

  return (
    <Dialog onOpenChange={(open) => {
      if (!open) {
        setIsScanning(false);
        if (videoRef.current?.srcObject instanceof MediaStream) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
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
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
          />
          <div className="absolute inset-0 border-2 border-wedding-pink/50 rounded-lg" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;