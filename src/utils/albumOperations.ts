import { supabase } from "@/integrations/supabase/client";

export const checkExistingAlbumEntry = async (photoId: string, albumId: string) => {
  const { data, error } = await supabase
    .from('photo_albums')
    .select()
    .eq('photo_id', photoId)
    .eq('album_id', albumId)
    .maybeSingle();

  if (error) {
    console.error('Error checking existing entry:', error);
    return { error };
  }

  return { data };
};

export const addPhotoLike = async (photoId: string, userId: string) => {
  try {
    const { data: existingLike, error: likeError } = await supabase
      .from('photo_likes')
      .select()
      .eq('photo_id', photoId)
      .eq('user_id', userId)
      .maybeSingle();

    if (likeError) {
      console.error('Error checking existing like:', likeError);
      return { error: likeError };
    }

    if (!existingLike) {
      const { error: insertError } = await supabase
        .from('photo_likes')
        .insert([{ photo_id: photoId, user_id: userId }]);

      if (insertError) {
        console.error('Error inserting like:', insertError);
        return { error: insertError };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in addPhotoLike:', error);
    return { error };
  }
};