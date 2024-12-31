import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface WeddingDetails {
  firstName: string;
  partnerName: string;
  date?: Date;
  selectedImage: string | null;
}

const processCoupleName = (firstName: string, partnerName: string): string => {
  if (firstName.includes(" & ")) {
    return firstName;
  }
  return partnerName ? `${firstName} & ${partnerName}` : firstName;
};

const uploadWeddingPhoto = async (selectedImage: string): Promise<string | null> => {
  try {
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    const file = new File([blob], 'wedding-photo.jpg', { type: 'image/jpeg' });
    const fileName = `wedding-photos/${crypto.randomUUID()}.jpg`;
    
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
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

const saveWeddingDetails = async (
  userId: string, 
  coupleNames: string, 
  date: Date | undefined, 
  photoUrl: string | null
) => {
  const { data: existingDetails } = await supabase
    .from('wedding_details')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingDetails) {
    return supabase
      .from('wedding_details')
      .update({
        couple_names: coupleNames,
        wedding_date: date?.toISOString(),
        photo_url: photoUrl
      })
      .eq('user_id', userId);
  }

  return supabase
    .from('wedding_details')
    .insert({
      user_id: userId,
      couple_names: coupleNames,
      wedding_date: date?.toISOString(),
      photo_url: photoUrl
    });
};

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

      const coupleNames = processCoupleName(firstName, partnerName);
      
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

      const result = await saveWeddingDetails(user.id, coupleNames, date, photoUrl);

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