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
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="firstName">Your first name</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Enter your first name"
        />
      </div>

      <div className="space-y-4">
        <Label>I am the...</Label>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className={`cursor-pointer transition-all ${
              role === "bride"
                ? "border-wedding-pink ring-2 ring-wedding-pink"
                : "hover:border-wedding-pink/50"
            }`}
            onClick={() => onRoleChange("bride")}
          >
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-full aspect-square bg-wedding-pink/10 flex items-center justify-center">
                <img
                  src="/lovable-uploads/b4b88587-9692-4902-af6d-899e3699d26a.png"
                  alt="Bride"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              role === "groom"
                ? "border-wedding-pink ring-2 ring-wedding-pink"
                : "hover:border-wedding-pink/50"
            }`}
            onClick={() => onRoleChange("groom")}
          >
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-full aspect-square bg-wedding-pink/10 flex items-center justify-center">
                <img
                  src="/lovable-uploads/da2d8b46-2e02-4f6b-a9d7-f7bf866e5243.png"
                  alt="Groom"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};