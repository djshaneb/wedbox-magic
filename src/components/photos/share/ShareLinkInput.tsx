import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="relative flex items-center gap-2 w-full">
      <Input
        value={shareLink || ""}
        readOnly
        className="pr-4 bg-gray-50/50 border-gray-200 focus-visible:ring-violet-500"
      />
      <motion.div
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleCopy}
          disabled={!shareLink}
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 bg-white hover:bg-gray-100 transition-colors"
        >
          {isCopied ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Copy className="h-5 w-5 text-gray-500" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};