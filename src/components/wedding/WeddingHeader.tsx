import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarHeart } from "lucide-react";

export const WeddingHeader = () => {
  const { data: weddingDetails, isLoading } = useQuery({
    queryKey: ['weddingDetails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wedding_details')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !weddingDetails) return null;

  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-wedding-pink/10">
      {weddingDetails.photo_url && (
        <img
          src={weddingDetails.photo_url}
          alt="Wedding couple"
          className="w-12 h-12 rounded-full object-cover border-2 border-wedding-pink"
        />
      )}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800">
          {weddingDetails.couple_names}
        </h2>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <CalendarHeart className="w-4 h-4 text-wedding-pink" />
          <span>
            {format(new Date(weddingDetails.wedding_date), 'MMMM d, yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
};