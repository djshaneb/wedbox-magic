import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { X, ArrowRight, ArrowLeft, Calendar as CalendarIcon, Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WeddingImageSelector } from "@/components/onboarding/WeddingImageSelector";
import { format } from "date-fns";

const formSchema = z.object({
  partnerName: z.string().min(1, "Partner's name is required"),
  partnerEmail: z.string().email("Invalid email address"),
});

const GetStarted = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"bride" | "groom" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date("2024-12-29"));
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
    } else {
      form.handleSubmit((data) => {
        console.log({ role, firstName, selectedImage, date, ...data });
        navigate("/");
      })();
    }
  };

  const handlePrevious = () => {
    if (step === 2) {
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
          <>
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
                  <div className="mb-2 h-48 w-full bg-[url('/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png')] bg-[length:200%] bg-left bg-no-repeat" />
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
                  <div className="mb-2 h-48 w-full bg-[url('/lovable-uploads/1beaa62f-b698-460f-9ebb-eff567ab8b44.png')] bg-[length:200%] bg-right bg-no-repeat" />
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
          </>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-light text-center mb-6">Our wedding date</h2>
            
            <div className="relative mb-4">
              <CalendarIcon className="w-32 h-32 text-wedding-pink mb-4" />
              <div className="text-3xl font-light text-center">
                {format(date || new Date(), "yyyy-MM-dd")}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="ml-2 inline-flex items-center justify-center rounded-full bg-wedding-pink text-white hover:bg-wedding-pink/90"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-gray-500 text-center mb-8">
              The wedding date can be changed later!
            </p>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 grid grid-cols-2 divide-x">
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePrevious}
            className="rounded-none h-16 bg-[#A5C9C5] hover:bg-[#94b8b4] text-white"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            PREVIOUS
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleNext}
            disabled={step === 1 ? (!role || !firstName.trim()) : false}
            className="rounded-none h-16 bg-gray-400 hover:bg-gray-500 text-white"
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