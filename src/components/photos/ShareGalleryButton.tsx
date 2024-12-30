import { useState } from "react";
import { Share2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { ShareDialog } from "./share/ShareDialog";
import { useNavigate } from "react-router-dom";

export const ShareGalleryButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const generateShareLink = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      if (!session) {
        console.error('No session found - redirecting to auth');
        navigate('/auth');
        throw new Error("Please sign in to share your gallery");
      }

      console.log('Generating share link for user:', session.user.id);
      
      // Generate a random access code
      const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Insert the new shared gallery record
      const { error: insertError } = await supabase
        .from('shared_galleries')
        .insert({
          owner_id: session.user.id,
          access_code: accessCode,
        });

      if (insertError) {
        console.error('Error inserting shared gallery:', insertError);
        throw new Error(`Failed to create shared gallery: ${insertError.message}`);
      }

      // Generate the share URL
      const shareUrl = `${window.location.origin}/shared/${accessCode}`;
      console.log('Successfully generated share URL:', shareUrl);
      setShareLink(shareUrl);
      
      toast({
        title: "Share link generated!",
        description: "Copy and share this link with your guests.",
        className: isMobile ? "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:top-4" : "top-[10%]"
      });
    } catch (error) {
      console.error('Error in generateShareLink:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate share link. Please try again.",
        variant: "destructive",
        className: isMobile ? "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:top-4" : "top-[10%]"
      });
    }
  };

  const handleCopy = () => {
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
      className: isMobile ? "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:top-4" : "top-[10%]"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group cursor-pointer w-full md:w-auto"
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