import { supabase } from "@/integrations/supabase/client";

export const uploadWeddingPhoto = async (selectedImage: string): Promise<string | null> => {
  try {
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    const file = new File([blob], 'wedding-photo.jpg', { type: 'image/jpeg' });
    const fileName = `wedding-photos/${crypto.randomUUID()}.jpg`;
    
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};