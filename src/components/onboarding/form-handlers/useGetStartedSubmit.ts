import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { uploadWeddingPhoto } from "./usePhotoUpload";
import { saveWeddingDetails } from "./useWeddingDetails";

interface WeddingDetails {
  firstName: string;
  partnerName: string;
  date?: Date;
  selectedImage: string | null;
}

export const useGetStartedSubmit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async ({
    firstName,
    partnerName,
    date,
    selectedImage,
  }: WeddingDetails) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
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
        user.id,
        firstName,
        date,
        photoUrl
      );

      if (result.error) throw result.error;

      toast({
        title: "Wedding details saved!",
        description: "Your wedding information has been saved successfully.",
      });

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