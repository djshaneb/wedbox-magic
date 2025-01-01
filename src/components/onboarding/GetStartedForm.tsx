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
  partnerEmail: z.string().email("Invalid email address"),
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
          setFirstName={(name) => {
            setFirstName(name);
            if (step === 4) setHasEditedNames(true);
          }}
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