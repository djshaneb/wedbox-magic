import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NavigationButtons } from "./NavigationButtons";
import { GetStartedSteps } from "./GetStartedSteps";

const formSchema = z.object({
  partnerName: z.string().min(1, "Partner's name is required"),
  partnerEmail: z.string().email("Invalid email address"),
});

export const GetStartedForm = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"bride" | "groom" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerName: "",
      partnerEmail: "",
    },
  });

  const handleNext = async () => {
    if (step === 1) {
      if (role && firstName.trim()) {
        setStep(2);
      }
    } else if (step === 2) {
      form.handleSubmit(() => {
        setStep(3);
      })();
    } else if (step === 3) {
      setStep(4);
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const coupleNames = `${firstName} & ${form.getValues().partnerName}`;
        
        let photoUrl = null;
        if (selectedImage) {
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

            photoUrl = publicUrl;
          } catch (error) {
            console.error('Error processing image:', error);
            toast({
              title: "Error uploading image",
              description: "There was a problem uploading your wedding photo.",
              variant: "destructive",
            });
            return;
          }
        }

        const { data: existingDetails } = await supabase
          .from('wedding_details')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        let result;
        
        if (existingDetails) {
          result = await supabase
            .from('wedding_details')
            .update({
              couple_names: coupleNames,
              wedding_date: date?.toISOString(),
              photo_url: photoUrl
            })
            .eq('user_id', user.id);
        } else {
          result = await supabase
            .from('wedding_details')
            .insert({
              user_id: user.id,
              couple_names: coupleNames,
              wedding_date: date?.toISOString(),
              photo_url: photoUrl
            });
        }

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
    }
  };

  const handlePrevious = () => {
    if (step === 4) {
      setStep(3);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container max-w-md mx-auto px-4 py-8 flex flex-col">
        <h1 className="text-3xl font-light text-center text-wedding-pink mb-8">
          Create new wedding
        </h1>
        
        <GetStartedSteps
          form={form}
          step={step}
          role={role}
          firstName={firstName}
          selectedImage={selectedImage}
          date={date}
          setRole={setRole}
          setFirstName={setFirstName}
          setSelectedImage={setSelectedImage}
          setDate={setDate}
        />

        <NavigationButtons
          onPrevious={handlePrevious}
          onNext={handleNext}
          isNextDisabled={step === 1 ? (!role || !firstName.trim()) : false}
          isLastStep={step === 4}
        />
      </main>
    </div>
  );
};