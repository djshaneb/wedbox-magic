import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WeddingHeaderProps {
  sharedGalleryOwnerId?: string;
}

export const WeddingHeader = ({ sharedGalleryOwnerId }: WeddingHeaderProps) => {
  const { data: weddingDetails } = useQuery({
    queryKey: ['weddingDetails', sharedGalleryOwnerId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = sharedGalleryOwnerId || user?.id;
      
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('wedding_details')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: true
  });

  if (!weddingDetails) return null;

  return (
    <div className={`text-center py-2 ${sharedGalleryOwnerId ? '-mt-8' : 'mt-16'}`}>
      <h1 className="text-2xl font-bold text-gray-900">{weddingDetails.couple_names}</h1>
      <p className="text-gray-600 text-sm">
        {new Date(weddingDetails.wedding_date).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
      {weddingDetails.photo_url && (
        <div className="mt-2">
          <img
            src={weddingDetails.photo_url}
            alt={weddingDetails.couple_names}
            className="w-24 h-24 object-cover rounded-full mx-auto"
          />
        </div>
      )}
    </div>
  );
};