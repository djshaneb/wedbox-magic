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

    // Create thumbnail
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = selectedImage;
    });

    // Calculate thumbnail dimensions (max 300px)
    const maxSize = 300;
    let width = img.width;
    let height = img.height;
    
    if (width > height) {
      if (width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(img, 0, 0, width, height);

    // Convert to WebP with lower quality for thumbnails
    const thumbnailBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/webp', 0.6); // Lower quality for thumbnails
    });

    // Upload thumbnail
    const { error: thumbnailError } = await supabase.storage
      .from('photos')
      .upload(thumbnailName, thumbnailBlob);

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