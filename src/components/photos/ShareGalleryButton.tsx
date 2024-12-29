import { useState } from "react";
import { Share2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { ShareDialog } from "./share/ShareDialog";

export const ShareGalleryButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
        className: isMobile ? "top-[5%] w-[calc(100%-32px)] mx-auto" : "top-[10%]"
      });
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
        className: isMobile ? "top-[5%] w-[calc(100%-32px)] mx-auto" : "top-[10%]"
      });
    }
  };

  const handleCopy = () => {
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
      className: isMobile ? "top-[5%] w-[calc(100%-32px)] mx-auto" : "top-[10%]"
    });
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
      <ShareDialog shareLink={shareLink} onCopy={handleCopy} />
    </Dialog>
  );
};