import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleSelection } from "@/components/onboarding/RoleSelection";
import { PartnerInformation } from "@/components/onboarding/PartnerInformation";
import { DateSelection } from "@/components/onboarding/DateSelection";
import { WeddingSummary } from "@/components/onboarding/WeddingSummary";
import { NavigationButtons } from "@/components/onboarding/NavigationButtons";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  partnerName: z.string().min(1, "Partner's name is required"),
  partnerEmail: z.string().email("Invalid email address"),
});

const GetStarted = () => {
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
        
        // Handle image upload if there's a selected image
        let photoUrl = null;
        if (selectedImage) {
          try {
            // Convert base64 to blob if it's a data URL
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            const file = new File([blob], 'wedding-photo.jpg', { type: 'image/jpeg' });

            // Upload to Supabase Storage
            const fileName = `wedding-photos/${crypto.randomUUID()}.jpg`;
            
            const { error: uploadError } = await supabase.storage
              .from('photos')
              .upload(fileName, file);

            if (uploadError) {
              console.error('Upload error:', uploadError);
              throw uploadError;
            }

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('photos')
              .getPublicUrl(fileName);

            photoUrl = publicUrl;
            console.log('Uploaded photo URL:', photoUrl);
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

        // First check if wedding details already exist for this user
        const { data: existingDetails } = await supabase
          .from('wedding_details')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        let result;
        
        if (existingDetails) {
          // Update existing record
          result = await supabase
            .from('wedding_details')
            .update({
              couple_names: coupleNames,
              wedding_date: date?.toISOString(),
              photo_url: photoUrl
            })
            .eq('user_id', user.id);
        } else {
          // Insert new record
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
        
        {step === 1 ? (
          <RoleSelection
            role={role}
            firstName={firstName}
            onRoleChange={setRole}
            onFirstNameChange={setFirstName}
          />
        ) : step === 2 ? (
          <PartnerInformation
            form={form}
            onSubmit={handleNext}
          />
        ) : step === 3 ? (
          <DateSelection date={date} onDateChange={setDate} />
        ) : (
          <WeddingSummary
            firstName={firstName}
            partnerName={form.getValues().partnerName}
            date={date}
            onEditDate={setDate}
            onEditNames={(first, partner) => {
              setFirstName(first);
              form.setValue("partnerName", partner);
            }}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
        )}

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

export default GetStarted;