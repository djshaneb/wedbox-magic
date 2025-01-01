import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Copy, CheckCircle2 } from "lucide-react";

interface ShareLinkInputProps {
  shareLink: string | null;
  onCopy: () => void;
}

export const ShareLinkInput = ({ shareLink, onCopy }: ShareLinkInputProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!shareLink) return;
    
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      onCopy();
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="relative flex-1">
      <Input
        value={shareLink || ""}
        readOnly
        className="pr-10 bg-gray-50/50 border-gray-200 focus-visible:ring-violet-500"
      />
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        disabled={!shareLink}
      >
        {isCopied ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-500" />
        )}
      </motion.button>
    </div>
  );
};