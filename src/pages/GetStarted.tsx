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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerName: "",
      partnerEmail: "",
    },
  });

  const handleNext = () => {
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
      console.log({ role, firstName, selectedImage, date, ...form.getValues() });
      navigate("/");
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
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            onSubmit={handleNext}
          />
        ) : step === 3 ? (
          <DateSelection date={date} onDateChange={setDate} />
        ) : (
          <WeddingSummary
            firstName={firstName}
            partnerName={form.getValues().partnerName}
            date={date}
            onEditDate={() => setStep(3)}
            onEditNames={() => setStep(1)}
            onEditPhoto={() => setStep(2)}
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