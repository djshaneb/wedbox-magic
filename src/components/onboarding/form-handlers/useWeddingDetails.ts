import { supabase } from "@/integrations/supabase/client";

export const saveWeddingDetails = async (
  userId: string, 
  coupleNames: string, 
  date: Date | undefined, 
  photoUrl: string | null
) => {
  const { data: existingDetails } = await supabase
    .from('wedding_details')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingDetails) {
    return supabase
      .from('wedding_details')
      .update({
        couple_names: coupleNames,
        wedding_date: date?.toISOString(),
        photo_url: photoUrl
      })
      .eq('user_id', userId);
  }

  return supabase
    .from('wedding_details')
    .insert({
      user_id: userId,
      couple_names: coupleNames,
      wedding_date: date?.toISOString(),
      photo_url: photoUrl
    });
};