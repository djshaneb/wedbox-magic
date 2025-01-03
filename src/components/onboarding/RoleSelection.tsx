import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface RoleSelectionProps {
  role: "bride" | "groom" | null;
  firstName: string;
  onRoleChange: (role: "bride" | "groom" | null) => void;
  onFirstNameChange: (name: string) => void;
}

export const RoleSelection = ({
  role,
  firstName,
  onRoleChange,
  onFirstNameChange,
}: RoleSelectionProps) => {
  return (
    <div className="space-y-3 md:space-y-8 flex-1 flex flex-col">
      <div className="space-y-2 md:space-y-4">
        <Label htmlFor="firstName" className="text-base md:text-lg text-gray-700">Your first name</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Enter your first name"
          className="h-9 md:h-12 text-base md:text-lg"
        />
      </div>

      <div className="space-y-3 md:space-y-6 flex-1 flex flex-col">
        <Label className="text-base md:text-lg text-gray-700">I am the...</Label>
        <div className="grid grid-cols-2 gap-2 md:gap-6 justify-center">
          <div className="w-full max-w-[140px] md:max-w-[160px]">
            <Card
              className={`cursor-pointer transition-all transform hover:scale-105 duration-200 ${
                role === "bride"
                  ? "border-wedding-pink ring-2 ring-wedding-pink shadow-lg"
                  : "hover:border-wedding-pink/50 hover:shadow-md"
              }`}
              onClick={() => onRoleChange("bride")}
            >
              <CardContent className="p-0">
                <div className="aspect-square">
                  <img
                    src="/lovable-uploads/b4b88587-9692-4902-af6d-899e3699d26a.png"
                    alt="Bride"
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full max-w-[140px] md:max-w-[160px]">
            <Card
              className={`cursor-pointer transition-all transform hover:scale-105 duration-200 ${
                role === "groom"
                  ? "border-wedding-pink ring-2 ring-wedding-pink shadow-lg"
                  : "hover:border-wedding-pink/50 hover:shadow-md"
              }`}
              onClick={() => onRoleChange("groom")}
            >
              <CardContent className="p-0">
                <div className="aspect-square">
                  <img
                    src="/lovable-uploads/ba6f8052-7ace-4288-9b32-508c94ed0496.png"
                    alt="Groom"
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};