import { Card } from "@/components/ui/card";
import { Photo } from "@/hooks/use-photos";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  isMobile: boolean;
  hideDelete?: boolean;
  isSharedView?: boolean;
  onLikeUpdate?: (photoId: string, isLiked: boolean, likeCount: number) => void;
  showRemoveButton?: boolean;
  onRemovePhoto?: (photoId: string) => void;
}

export const PhotoCard = ({ 
  photo, 
  onClick, 
  isMobile,
  isSharedView = false,
  onLikeUpdate,
  showRemoveButton = false,
  onRemovePhoto
}: PhotoCardProps) => {
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

    if (!isSharedView) {
      fetchLikeState();
    }
  }, [photo.id, isSharedView]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get the user's Favourites album
      const { data: favouritesAlbum } = await supabase
        .from('albums')
        .select('*')
        .eq('user_id', user.id)
        .eq('name', 'Favourites')
        .single();

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
          .single();

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
            .single();

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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemovePhoto) {
      onRemovePhoto(photo.id);
    }
  };

  return (
    <Card 
      className={`mb-2 overflow-hidden ${
        isMobile ? 'shadow-none border-violet-200/20' : 'shadow-md'
      } cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group relative`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={photo.thumbnail_url || photo.url}
          alt="Gallery photo"
          className="w-full h-full object-cover aspect-square md:aspect-auto group-hover:brightness-105 transition-all duration-300"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 flex gap-2">
          {showRemoveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
              onClick={handleRemove}
            >
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          )}
          {!isSharedView && (
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
          )}
        </div>
      </div>
    </Card>
  );
};
