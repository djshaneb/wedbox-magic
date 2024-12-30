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
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-full aspect-square bg-wedding-pink/10 rounded-full flex items-center justify-center">
                <img
                  src="/placeholder.svg"
                  alt="Bride"
                  className="w-3/4 h-3/4 object-contain"
                />
              </div>
              <p className="font-medium">Bride</p>
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
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-full aspect-square bg-wedding-pink/10 rounded-full flex items-center justify-center">
                <img
                  src="/lovable-uploads/1f09b5c7-2101-4821-8d8f-9a0b259f5bd7.png"
                  alt="Groom"
                  className="w-3/4 h-3/4 object-contain"
                />
              </div>
              <p className="font-medium">Groom</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};