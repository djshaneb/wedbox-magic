interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeGestureConfig) => {
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX = event.touches[0].clientX;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};