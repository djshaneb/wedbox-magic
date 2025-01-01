import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShareDialog } from "./share/ShareDialog";

export const ShareGalleryButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateShareLink = async () => {
    try {
      setIsLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to share your gallery",
          variant: "destructive",
        });
        return;
      }

      const userId = sessionData.session.user.id;
      console.log('Checking for existing share link for user:', userId);
      
      // First, check if user already has a shared gallery - get the most recent one
      const { data: existingGallery, error: fetchError } = await supabase
        .from('shared_galleries')
        .select('access_code')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Failed to check existing gallery:', fetchError);
        throw new Error('Failed to check existing gallery');
      }

      if (existingGallery?.access_code) {
        console.log('Found existing gallery:', existingGallery);
        setShareLink(`${window.location.origin}/shared/${existingGallery.access_code}`);
        return;
      }

      // If no existing gallery, create a new one
      console.log('No existing gallery found, creating new one');
      const accessCode = Math.random().toString(36).substring(2, 15);
      
      const { error: insertError } = await supabase
        .from('shared_galleries')
        .insert([
          { owner_id: userId, access_code: accessCode }
        ]);

      if (insertError) {
        console.error('Failed to create shared gallery:', insertError);
        throw new Error('Failed to create shared gallery');
      }

      setShareLink(`${window.location.origin}/shared/${accessCode}`);
      
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = async () => {
    setIsDialogOpen(true);
    if (!shareLink) {
      await generateShareLink();
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        variant="outline"
        className="w-full bg-white hover:bg-gray-50"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share Gallery
      </Button>

      <ShareDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        shareLink={shareLink}
        isLoading={isLoading}
      />
    </>
  );
};