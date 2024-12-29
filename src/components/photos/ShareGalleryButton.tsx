import { useState } from "react";
import { Share2, Copy, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const ShareGalleryButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generateShareLink = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { error } = await supabase
        .from('shared_galleries')
        .insert({
          owner_id: user.id,
          access_code: accessCode,
        });

      if (error) throw error;

      const shareUrl = `${window.location.origin}/shared/${accessCode}`;
      setShareLink(shareUrl);
      
      toast({
        title: "Share link generated!",
        description: "Copy and share this link with your guests.",
        className: "top-[10%]"
      });
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!shareLink) return;
    
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
        className: "top-[10%]"
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy link. Please try manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group cursor-pointer"
          onClick={() => !shareLink && generateShareLink()}
        >
          <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-violet-500/90 via-purple-500/90 to-fuchsia-500/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <Share2 className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-white font-medium">Share Gallery</span>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Share Your Gallery
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share this link with your guests to let them view and contribute to your photo gallery!
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  value={shareLink || ""}
                  readOnly
                  className="pr-10 bg-gray-50/50 border-gray-200 focus-visible:ring-violet-500"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};