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
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[200px] font-bold text-white animate-pulse">
            {countdown}
          </span>
        </div>
      )}

      {isCameraReady && !isCountingDown && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl font-bold text-white bg-black/50 px-6 py-2 rounded-full">
            Tap anywhere to start 5s countdown
          </div>
        </div>
      )}
    </>
  );
};