import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { NavigationButtons } from "./NavigationButtons";
import { GetStartedSteps } from "./GetStartedSteps";
import { useGetStartedSubmit } from "./form-handlers/useGetStartedSubmit";

const formSchema = z.object({
  partnerName: z.string().min(1, "Partner's name is required"),
});

export const GetStartedForm = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"bride" | "groom" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hasEditedNames, setHasEditedNames] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleSubmit: handleFormSubmit } = useGetStartedSubmit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerName: "",
    },
  });

  const handleNext = async () => {
    if (step === 1) {
      if (!role) {
        toast({
          title: "Please select your role",
          description: "Choose whether you are the bride or groom",
          variant: "destructive",
        });
        return;
      }
      if (!firstName.trim()) {
        toast({
          title: "Please enter your name",
          description: "Your first name is required",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const partnerName = form.getValues().partnerName;
      if (!partnerName.trim()) {
        toast({
          title: "Partner's name required",
          description: "Please enter your partner's first name",
          variant: "destructive",
        });
        form.setError("partnerName", {
          type: "manual",
          message: "Partner's name is required",
        });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!date) {
        toast({
          title: "Wedding date required",
          description: "Please select your wedding date",
          variant: "destructive",
        });
        return;
      }
      setStep(4);
    } else {
      await handleFormSubmit({
        firstName: hasEditedNames ? firstName : `${firstName} & ${form.getValues().partnerName}`,
        partnerName: form.getValues().partnerName,
        date,
        selectedImage,
      });
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

  const isNextDisabled = () => {
    if (step === 1) {
      return !role || !firstName.trim();
    }
    if (step === 2) {
      return !form.getValues().partnerName.trim();
    }
    if (step === 3) {
      return !date;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container max-w-md mx-auto px-4 py-4 md:py-12 flex flex-col h-[calc(100vh-64px)]">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mb-4 md:mb-16 flex-1 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-light text-center text-wedding-pink mb-6 md:mb-12">
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
            setFirstName={(name) => {
              setFirstName(name);
              if (step === 4) setHasEditedNames(true);
            }}
            setSelectedImage={setSelectedImage}
            setDate={setDate}
          />
        </div>

        <NavigationButtons
          onPrevious={handlePrevious}
          onNext={handleNext}
          isNextDisabled={isNextDisabled()}
          isLastStep={step === 4}
        />
      </main>
    </div>
  );
};