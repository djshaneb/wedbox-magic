import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePhotos } from "@/hooks/use-photos";

export const OnboardingGuide = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { photos } = usePhotos();

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenPhotoGuide");
    if (!hasSeenGuide) {
      setIsVisible(true);
      localStorage.setItem("hasSeenPhotoGuide", "true");
    }
  }, []);

  // Hide guide when photos are added
  useEffect(() => {
    if (photos.length > 0) {
      setIsVisible(false);
    }
  }, [photos]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-32 right-8 z-40 flex flex-col items-end"
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200/50 max-w-[200px] mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-sm text-gray-700 font-medium">
              Start your journey here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Click the plus button to add your first photo
            </p>
          </motion.div>
          
          <motion.div
            className="flex flex-col items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ChevronDown 
              className="h-6 w-6 text-indigo-500 animate-bounce" 
            />
            <div className="h-16 w-px bg-gradient-to-b from-indigo-500 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};