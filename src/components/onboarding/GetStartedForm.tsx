import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavigationButtons } from "./NavigationButtons";
import { GetStartedSteps } from "./GetStartedSteps";
import { useGetStartedSubmit } from "./form-handlers/useGetStartedSubmit";

const formSchema = z.object({
  partnerName: z.string().min(1, "Partner's name is required").optional(),
  partnerEmail: z.string().email("Invalid email address").optional(),
});

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
];

export const GetStartedForm = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"bride" | "groom" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(PLACEHOLDER_IMAGES[0]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hasEditedNames, setHasEditedNames] = useState(false);
  const navigate = useNavigate();
  const { handleSubmit: handleFormSubmit } = useGetStartedSubmit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerName: "",
      partnerEmail: "",
    },
  });

  const onSubmit = async () => {
    const formData = form.getValues();
    await handleFormSubmit({
      firstName,
      partnerName: formData.partnerName || "",
      partnerEmail: formData.partnerEmail,
      date,
      selectedImage,
    });
  };

  const handleNext = async () => {
    if (step === 2) {
      const result = await form.trigger();
      if (!result) return;
    }

    if (step === 4) {
      await onSubmit();
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      navigate("/auth");
      return;
    }
    setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container max-w-2xl mx-auto px-4 py-8">
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
      </div>
      <NavigationButtons
        step={step}
        onPrevious={handleBack}
        onNext={handleNext}
        isNextDisabled={false}
        isLastStep={step === 4}
      />
    </div>
  );
};