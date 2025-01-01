import { useState } from "react";
import { RoleSelection } from "./RoleSelection";
import { PartnerInformation } from "./PartnerInformation";
import { DateSelection } from "./DateSelection";
import { WeddingSummary } from "./WeddingSummary";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  partnerName: z.string().min(1, "Partner's name is required"),
});

interface GetStartedStepsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  step: number;
  role: "bride" | "groom" | null;
  firstName: string;
  selectedImage: string | null;
  date: Date | undefined;
  setRole: (role: "bride" | "groom" | null) => void;
  setFirstName: (name: string) => void;
  setSelectedImage: (image: string | null) => void;
  setDate: (date: Date | undefined) => void;
}

export const GetStartedSteps = ({
  form,
  step,
  role,
  firstName,
  selectedImage,
  date,
  setRole,
  setFirstName,
  setSelectedImage,
  setDate,
}: GetStartedStepsProps) => {
  const [partnerRole, setPartnerRole] = useState<"bride" | "groom" | null>(
    role === "bride" ? "groom" : role === "groom" ? "bride" : null
  );

  return (
    <>
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
          partnerRole={partnerRole}
          onPartnerRoleChange={setPartnerRole}
          onSubmit={() => {}}
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
    </>
  );
};