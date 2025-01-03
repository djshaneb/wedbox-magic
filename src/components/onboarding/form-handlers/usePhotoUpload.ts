import { supabase } from "@/integrations/supabase/client";

export const uploadWeddingPhoto = async (selectedImage: string): Promise<string | null> => {
  try {
    // Get the original file
    const response = await fetch(selectedImage);
    const originalBlob = await response.blob();
    
    // Generate unique IDs for both files
    const originalFileName = `wedding-photos/${crypto.randomUUID()}.${originalBlob.type.split('/')[1]}`;
    const thumbnailName = `wedding-photos/thumbnails/${crypto.randomUUID()}.webp`;
    
    // Upload original image
    const { error: originalUploadError } = await supabase.storage
      .from('photos')
      .upload(originalFileName, originalBlob);

    if (originalUploadError) {
      console.error('Original upload error:', originalUploadError);
      throw originalUploadError;
    }

    // Create and upload thumbnail
    const thumbnailFile = new File([originalBlob], 'thumbnail.webp', { type: 'image/webp' });
    const { error: thumbnailError } = await supabase.storage
      .from('photos')
      .upload(thumbnailName, thumbnailFile);

    if (thumbnailError) {
      console.error('Thumbnail upload error:', thumbnailError);
      throw thumbnailError;
    }

    // Get the public URL for the original image
    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(originalFileName);

    return publicUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};