import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePhotoLikes = (photoId: string, initialLikeCount: number, initialIsLiked: boolean) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleLike = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like photos",
          variant: "destructive",
        });
        return;
      }

      if (isLiked) {
        const { error } = await supabase
          .from('photo_likes')
          .delete()
          .eq('photo_id', photoId)
          .eq('user_id', user.id);

        if (error) throw error;
        setLikeCount(prev => prev - 1);
      } else {
        const { error } = await supabase
          .from('photo_likes')
          .insert({ photo_id: photoId, user_id: user.id });

        if (error) throw error;
        setLikeCount(prev => prev + 1);
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    likeCount,
    isLiked,
    isLoading,
    toggleLike,
  };
};