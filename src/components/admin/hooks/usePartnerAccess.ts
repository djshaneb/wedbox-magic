import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePartnerAccess = () => {
  const queryClient = useQueryClient();

  const { data: weddingDetails } = useQuery({
    queryKey: ["weddingDetails"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) throw new Error("No user session");

      const { data, error } = await supabase
        .from("wedding_details")
        .select("couple_names")
        .eq("user_id", session.session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: partnerAccess, isLoading } = useQuery({
    queryKey: ["partnerAccess"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) throw new Error("No user session");

      const { data, error } = await supabase
        .from("partner_access")
        .select("*")
        .or(`user_id.eq.${session.session.user.id},partner_email.eq.${session.session.user.email}`);
      
      if (error) throw error;
      return data;
    },
  });

  const addPartnerMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) throw new Error("No user session");

      const partnerName = weddingDetails?.couple_names?.split(" & ")[1] || "Partner";

      const { error: insertError } = await supabase
        .from("partner_access")
        .insert({
          partner_email: email,
          partner_name: partnerName,
          user_id: session.session.user.id
        });
      
      if (insertError) throw insertError;

      const { error: inviteError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            wedding_id: session.session.user.id,
            role: 'admin'
          }
        }
      });

      if (inviteError) throw inviteError;
    },
    onSuccess: () => {
      toast.success("Partner access granted and invitation sent");
      queryClient.invalidateQueries({ queryKey: ["partnerAccess"] });
    },
    onError: (error) => {
      if (error.message?.includes('rate_limit')) {
        toast.error("Please wait a minute before sending another invitation");
      } else {
        toast.error("Failed to add partner access: " + error.message);
      }
    },
  });

  const removePartnerMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) throw new Error("No user session");

      const { error } = await supabase
        .from("partner_access")
        .delete()
        .eq("partner_email", email)
        .eq("user_id", session.session.user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Partner access removed");
      queryClient.invalidateQueries({ queryKey: ["partnerAccess"] });
    },
    onError: (error) => {
      toast.error("Failed to remove partner access: " + error.message);
    },
  });

  return {
    weddingDetails,
    partnerAccess,
    isLoading,
    addPartnerMutation,
    removePartnerMutation
  };
};