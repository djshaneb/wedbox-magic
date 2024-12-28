import React, { useRef } from "react";
import { RefreshCw } from "lucide-react";

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
    <>
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <span className="text-[200px] font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] animate-pulse">
            {countdown}
          </span>
        </div>
      )}

      {isCameraReady && !isCountingDown && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl font-light text-white bg-black/50 backdrop-blur-md px-8 py-3 rounded-full shadow-lg border border-white/10 tracking-wide">
            Tap anywhere to start 5s countdown
          </div>
        </div>
      )}
    </>
  );
};