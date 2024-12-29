import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X, ArrowRight } from "lucide-react";

const GetStarted = () => {
  const [role, setRole] = useState<"bride" | "groom" | null>(null);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (role && firstName.trim()) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container max-w-md mx-auto px-4 py-8 flex flex-col">
        <h1 className="text-3xl font-light text-center text-wedding-pink mb-8">
          Create new wedding
        </h1>
        
        <h2 className="text-2xl text-center mb-6">I am...</h2>
        
        <RadioGroup
          className="grid grid-cols-2 gap-4 mb-8"
          value={role || ""}
          onValueChange={(value) => setRole(value as "bride" | "groom")}
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
              <div className="mb-2 h-48 w-full bg-[url('/lovable-uploads/d8ee984e-6ea9-4f57-8398-08173c4bb4b4.png')] bg-[length:200%] bg-left bg-no-repeat" />
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
              <div className="mb-2 h-48 w-full bg-[url('/lovable-uploads/d8ee984e-6ea9-4f57-8398-08173c4bb4b4.png')] bg-[length:200%] bg-right bg-no-repeat" />
              <span className="text-lg font-medium uppercase tracking-wide text-wedding-pink">Bride</span>
            </Label>
          </div>
        </RadioGroup>

        <Input
          type="text"
          placeholder="Your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mb-8 h-14 text-lg"
        />

        <div className="fixed bottom-0 left-0 right-0 grid grid-cols-2 divide-x border-t bg-gray-100">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate("/auth")}
            className="rounded-none h-16"
          >
            <X className="mr-2 h-5 w-5" />
            CANCEL
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleNext}
            disabled={!role || !firstName.trim()}
            className="rounded-none h-16"
          >
            NEXT
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default GetStarted;