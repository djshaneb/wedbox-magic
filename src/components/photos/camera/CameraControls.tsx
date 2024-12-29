import React from "react";
import { Button } from "@/components/ui/button";
import { Flashlight, Camera, RotateCcw } from "lucide-react";

interface CameraControlsProps {
  isFlashOn: boolean;
  onToggleFlash: () => void;
  onTakePhoto: () => void;
  onSwitchCamera: () => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  isFlashOn,
  onToggleFlash,
  onTakePhoto,
  onSwitchCamera,
}) => {
  return (
    <div className="absolute bottom-8 inset-x-0 flex justify-center items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
        onClick={onToggleFlash}
      >
        <Flashlight className={`h-6 w-6 ${isFlashOn ? 'text-yellow-400' : 'text-white'}`} />
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="rounded-full w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
        onClick={onTakePhoto}
      >
        <Camera className="h-8 w-8 text-white" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
        onClick={onSwitchCamera}
      >
        <RotateCcw className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};