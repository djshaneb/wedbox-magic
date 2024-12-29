import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RoleSelectionProps {
  role: "bride" | "groom" | null;
  firstName: string;
  onRoleChange: (role: "bride" | "groom") => void;
  onFirstNameChange: (name: string) => void;
}

export const RoleSelection = ({
  role,
  firstName,
  onRoleChange,
  onFirstNameChange,
}: RoleSelectionProps) => {
  return (
    <>
      <h2 className="text-2xl text-center mb-6">I am...</h2>
      
      <RadioGroup
        className="grid grid-cols-2 gap-4 mb-8"
        value={role || ""}
        onValueChange={(value) => onRoleChange(value as "bride" | "groom")}
      >
        <div className="relative">
          <RadioGroupItem
            value="groom"
            id="groom"
            className="peer sr-only"
          />
          <Label
            htmlFor="groom"
            className="flex flex-col items-center justify-between rounded-lg border-2 border-wedding-pink/20 p-4 hover:bg-wedding-pink/5 peer-checked:border-wedding-pink peer-checked:bg-wedding-pink/10 [&:has([data-state=checked])]:border-wedding-pink cursor-pointer"
          >
            <div className="mb-2 h-48 w-full bg-[url('/placeholder.svg')] bg-cover bg-center" />
            <span className="text-lg font-medium uppercase tracking-wide text-wedding-pink">Groom</span>
          </Label>
        </div>

        <div className="relative">
          <RadioGroupItem
            value="bride"
            id="bride"
            className="peer sr-only"
          />
          <Label
            htmlFor="bride"
            className="flex flex-col items-center justify-between rounded-lg border-2 border-wedding-pink/20 p-4 hover:bg-wedding-pink/5 peer-checked:border-wedding-pink peer-checked:bg-wedding-pink/10 [&:has([data-state=checked])]:border-wedding-pink cursor-pointer"
          >
            <div className="mb-2 h-48 w-full bg-[url('/placeholder.svg')] bg-cover bg-center" />
            <span className="text-lg font-medium uppercase tracking-wide text-wedding-pink">Bride</span>
          </Label>
        </div>
      </RadioGroup>

      <Input
        type="text"
        placeholder="Your first name"
        value={firstName}
        onChange={(e) => onFirstNameChange(e.target.value)}
        className="mb-8 h-14 text-lg"
      />
    </>
  );
};