import { useEffect, useRef } from "react";

export const useSwipeGesture = (onSwipeUp: () => void) => {
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartY.current) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchEndY - touchStartY.current;
      
      if (deltaY < -100) {
        onSwipeUp();
      }
      
      touchStartY.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeUp]);
};