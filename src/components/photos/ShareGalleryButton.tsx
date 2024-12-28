import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ShareGalleryButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const { toast } = useToast();

  const generateShareLink = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate a random 6-character code
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
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
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
        <Button
          variant="outline"
          onClick={() => !shareLink && generateShareLink()}
          className="bg-gradient-to-r from-violet-500/90 to-purple-500/90 hover:from-violet-600 hover:to-purple-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Gallery
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Gallery</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Share this link with your guests. They'll be able to view, upload photos, and use the photo booth!
          </p>
          <div className="flex gap-2">
            <Input
              value={shareLink || ""}
              readOnly
              className="bg-gray-50"
            />
            <Button onClick={copyToClipboard} disabled={!shareLink}>
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};