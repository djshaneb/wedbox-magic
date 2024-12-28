import React from "react";
import { RefreshCw, Hand } from "lucide-react";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isCameraReady: boolean;
  isCountingDown: boolean;
  countdown: number;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  isCameraReady,
  isCountingDown,
  countdown,
}) => {
  return (
    <div className="w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      
      {!isCameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <RefreshCw className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {isCountingDown && (
        <div className="absolute top-8 left-8">
          <span className="text-[100px] font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] animate-pulse">
            {countdown}
          </span>
        </div>
      )}

      {isCameraReady && !isCountingDown && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '-30vh' }}>
          <Hand 
            className="text-white/80 animate-bounce transform rotate-45" 
            size={80} 
            strokeWidth={1.5} 
          />
        </div>
      )}
    </div>
  );
};