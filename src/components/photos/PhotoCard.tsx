import { Card } from "@/components/ui/card";
import { Photo } from "@/hooks/use-photos";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddToAlbumDialog } from "@/components/albums/AddToAlbumDialog";

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  isMobile: boolean;
  hideDelete?: boolean;
  isSharedView?: boolean;
  onLikeUpdate?: (photoId: string, isLiked: boolean, likeCount: number) => void;
}

export const PhotoCard = ({ 
  photo, 
  onClick, 
  isMobile,
  isSharedView = false,
  onLikeUpdate
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
    e.stopPropagation(); // Prevent opening the lightbox
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!isLiked) {
        await supabase
          .from('photo_likes')
          .insert([{ photo_id: photo.id, user_id: user.id }]);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        if (onLikeUpdate) {
          onLikeUpdate(photo.id, true, likeCount + 1);
        }
        toast({
          title: "Photo liked!",
          description: "You've liked this photo",
        });
      } else {
        await supabase
          .from('photo_likes')
          .delete()
          .match({ photo_id: photo.id, user_id: user.id });
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        if (onLikeUpdate) {
          onLikeUpdate(photo.id, false, likeCount - 1);
        }
        toast({
          title: "Like removed",
          description: "You've unliked this photo",
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
        {!isSharedView && (
          <>
            <AddToAlbumDialog photoId={photo.id} />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
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
          </>
        )}
      </div>
    </Card>
  );
};