import { supabase } from "@/integrations/supabase/client";

export const uploadWeddingPhoto = async (selectedImage: string): Promise<string | null> => {
  try {
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    const file = new File([blob], 'wedding-photo.jpg', { type: 'image/jpeg' });
    const fileName = `wedding-photos/${crypto.randomUUID()}.jpg`;
    const thumbnailName = `wedding-photos/thumbnails/${crypto.randomUUID()}.jpg`;
    
    // Upload main image
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Create and upload thumbnail
    const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
    const { error: thumbnailError } = await supabase.storage
      .from('photos')
      .upload(thumbnailName, thumbnailFile);

    if (thumbnailError) {
      console.error('Thumbnail upload error:', thumbnailError);
      throw thumbnailError;
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