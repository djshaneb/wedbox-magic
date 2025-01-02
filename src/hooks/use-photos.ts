import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Photo {
  id: string;
  url: string;
  thumbnail_url: string;
  storage_path: string;
  likes_count?: number;
  is_liked?: boolean;
}

export const usePhotos = (sharedGalleryOwnerId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['photos', sharedGalleryOwnerId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const query = supabase
        .from('photos')
        .select(`
          *,
          likes:photo_likes(count),
          user_likes:photo_likes!inner(user_id)
        `)
        .order('created_at', { ascending: false });

      if (sharedGalleryOwnerId) {
        query.eq('user_id', sharedGalleryOwnerId);
      } else if (user) {
        query.eq('user_id', user.id);
      }

      const { data: photos, error } = await query;

      if (error) throw error;

      const photosWithUrls = await Promise.all(photos.map(async (photo) => {
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(photo.storage_path);
        
        const { data: { publicUrl: thumbnailUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(photo.thumbnail_path);
        
        return {
          id: photo.id,
          storage_path: photo.storage_path,
          url: publicUrl,
          thumbnail_url: thumbnailUrl,
          likes_count: photo.likes?.[0]?.count ?? 0,
          is_liked: photo.user_likes?.length > 0
        };
      }));

      return photosWithUrls;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ 
      file, 
      ownerId 
    }: { 
      file: File; 
      ownerId?: string;
    }) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user && !ownerId) throw new Error('No user authenticated');

        const userId = ownerId || user?.id;
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const thumbnailName = `thumbnails/${fileName}`;
        
        // First, upload the file to storage
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Create and upload thumbnail
        const { error: thumbnailError } = await supabase.storage
          .from('photos')
          .upload(thumbnailName, file);

        if (thumbnailError) throw thumbnailError;

        // Create the database record
        const { error: dbError } = await supabase
          .from('photos')
          .insert({ 
            storage_path: fileName,
            thumbnail_path: thumbnailName,
            user_id: userId
          });

        if (dbError) throw dbError;

        return fileName;
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast({
        title: "Photo uploaded",
        description: "Your photo has been added to the gallery",
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, storage_path }: { id: string, storage_path: string }) => {
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([storage_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast({
        title: "Photo deleted",
        description: "The photo has been removed from the gallery",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your photo",
        variant: "destructive",
      });
    }
  });

  const likeMutation = useMutation({
    mutationFn: async ({ photoId }: { photoId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user authenticated');

      const { error } = await supabase
        .from('photo_likes')
        .insert({ photo_id: photoId, user_id: user.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
    onError: (error) => {
      console.error('Like error:', error);
      toast({
        title: "Error",
        description: "Failed to like the photo",
        variant: "destructive",
      });
    }
  });

  const unlikeMutation = useMutation({
    mutationFn: async ({ photoId }: { photoId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user authenticated');

      const { error } = await supabase
        .from('photo_likes')
        .delete()
        .eq('photo_id', photoId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
    onError: (error) => {
      console.error('Unlike error:', error);
      toast({
        title: "Error",
        description: "Failed to unlike the photo",
        variant: "destructive",
      });
    }
  });

  return {
    photos,
    isLoading,
    uploadMutation,
    deleteMutation,
    likeMutation,
    unlikeMutation
  };
};
