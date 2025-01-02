import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Album {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const useAlbums = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: albums = [], isLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createAlbum = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('albums')
        .insert([{ name, description }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      toast({
        title: "Album created",
        description: "Your album has been created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating album:', error);
      toast({
        title: "Error",
        description: "Failed to create album",
        variant: "destructive",
      });
    }
  });

  const addPhotoToAlbum = useMutation({
    mutationFn: async ({ photoId, albumId }: { photoId: string; albumId: string }) => {
      const { error } = await supabase
        .from('photo_albums')
        .insert([{ photo_id: photoId, album_id: albumId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      toast({
        title: "Photo added",
        description: "Photo has been added to the album",
      });
    },
    onError: (error) => {
      console.error('Error adding photo to album:', error);
      toast({
        title: "Error",
        description: "Failed to add photo to album",
        variant: "destructive",
      });
    }
  });

  return {
    albums,
    isLoading,
    createAlbum,
    addPhotoToAlbum
  };
};