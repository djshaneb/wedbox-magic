import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { uploadWeddingPhoto } from "./usePhotoUpload";
import { saveWeddingDetails } from "./useWeddingDetails";

interface WeddingDetails {
  firstName: string;
  partnerName: string;
  partnerEmail?: string;
  date?: Date;
  selectedImage: string | null;
}

export const useGetStartedSubmit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async ({
    firstName,
    partnerName,
    partnerEmail,
    date,
    selectedImage,
  }: WeddingDetails) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast({
          title: "Authentication error",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      let photoUrl = null;
      if (selectedImage) {
        try {
          photoUrl = await uploadWeddingPhoto(selectedImage);
        } catch (error) {
          toast({
            title: "Error uploading image",
            description: "There was a problem uploading your wedding photo.",
            variant: "destructive",
          });
          return;
        }
      }

      const result = await saveWeddingDetails(
        session.user.id,
        firstName,
        date,
        photoUrl
      );

      if (result.error) throw result.error;
      if (!result.data) throw new Error('Failed to save wedding details');

      // If partner email is provided, send a magic link
      if (partnerEmail) {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: partnerEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              wedding_id: result.data.id,
              role: 'admin',
              inviter_name: firstName,
            }
          }
        });

        if (otpError) {
          toast({
            title: "Warning",
            description: "Wedding details saved, but we couldn't send an invitation to your partner. They can be invited later.",
            variant: "default",
          });
        } else {
          toast({
            title: "Success!",
            description: "Wedding details saved and invitation sent to your partner.",
          });
        }
      } else {
        toast({
          title: "Wedding details saved!",
          description: "Your wedding information has been saved successfully.",
        });
      }

      navigate("/");
    } catch (error) {
      console.error('Error saving wedding details:', error);
      toast({
        title: "Error saving details",
        description: "There was a problem saving your wedding details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
};