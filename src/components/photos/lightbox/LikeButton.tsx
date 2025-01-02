import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Photo } from "@/hooks/use-photos";

interface LikeButtonProps {
  photo: Photo;
  onLikeUpdate?: (photoId: string, isLiked: boolean, likeCount: number) => void;
}

export const LikeButton = ({ photo, onLikeUpdate }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLikeState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: likes } = await supabase
        .from('photo_likes')
        .select('*')
        .eq('photo_id', photo.id);

      const userLike = likes?.find(like => like.user_id === user.id);
      setIsLiked(!!userLike);
      setLikeCount(likes?.length || 0);
    };

    fetchLikeState();
  }, [photo.id]);

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get the user's Favourites album
      const { data: favouritesAlbum } = await supabase
        .from('albums')
        .select('*')
        .eq('user_id', user.id)
        .eq('name', 'Favourites')
        .maybeSingle();

      if (!favouritesAlbum) {
        console.error('Favourites album not found');
        return;
      }

      if (!isLiked) {
        // Check if like already exists
        const { data: existingLike } = await supabase
          .from('photo_likes')
          .select('*')
          .eq('photo_id', photo.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingLike) {
          // Add like if it doesn't exist
          await supabase
            .from('photo_likes')
            .upsert([{ photo_id: photo.id, user_id: user.id }]);

          // Check if photo is already in Favourites album
          const { data: existingAlbumPhoto } = await supabase
            .from('photo_albums')
            .select('*')
            .eq('photo_id', photo.id)
            .eq('album_id', favouritesAlbum.id)
            .maybeSingle();

          if (!existingAlbumPhoto) {
            // Add photo to Favourites album if it's not already there
            await supabase
              .from('photo_albums')
              .upsert([{ photo_id: photo.id, album_id: favouritesAlbum.id }]);
          }

          setIsLiked(true);
          setLikeCount(prev => prev + 1);
          if (onLikeUpdate) {
            onLikeUpdate(photo.id, true, likeCount + 1);
          }
          toast({
            title: "Photo liked!",
            description: "Photo has been added to your Favourites album",
          });
        }
      } else {
        // Remove like
        await supabase
          .from('photo_likes')
          .delete()
          .match({ photo_id: photo.id, user_id: user.id });

        // Remove photo from Favourites album
        await supabase
          .from('photo_albums')
          .delete()
          .match({ photo_id: photo.id, album_id: favouritesAlbum.id });

        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        if (onLikeUpdate) {
          onLikeUpdate(photo.id, false, likeCount - 1);
        }
        toast({
          title: "Like removed",
          description: "Photo has been removed from your Favourites album",
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
      onClick={handleLike}
    >
      <Heart 
        className={`h-5 w-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
      />
      {likeCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {likeCount}
        </span>
      )}
    </Button>
  );
};