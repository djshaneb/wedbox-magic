import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  partnerName: z.string().min(1, "Partner's name is required"),
});

interface PartnerInformationProps {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  partnerRole: "bride" | "groom" | null;
  onPartnerRoleChange: (role: "bride" | "groom" | null) => void;
  onSubmit: () => void;
}

export const PartnerInformation = ({
  form,
  partnerRole,
  onPartnerRoleChange,
  onSubmit,
}: PartnerInformationProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8 flex-1 flex flex-col">
        <h2 className="text-xl md:text-2xl text-center text-gray-700 mb-4 md:mb-8">My partner is...</h2>
        
        <div className="grid grid-cols-2 gap-3 md:gap-6 justify-center">
          <div className="w-full max-w-[160px]">
            <Card
              className={`cursor-pointer transition-all transform hover:scale-105 duration-200 ${
                partnerRole === "bride"
                  ? "border-wedding-pink ring-2 ring-wedding-pink shadow-lg"
                  : "hover:border-wedding-pink/50 hover:shadow-md"
              }`}
              onClick={() => onPartnerRoleChange("bride")}
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

          <div className="w-full max-w-[160px]">
            <Card
              className={`cursor-pointer transition-all transform hover:scale-105 duration-200 ${
                partnerRole === "groom"
                  ? "border-wedding-pink ring-2 ring-wedding-pink shadow-lg"
                  : "hover:border-wedding-pink/50 hover:shadow-md"
              }`}
              onClick={() => onPartnerRoleChange("groom")}
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

        <FormField
          control={form.control}
          name="partnerName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Your partner's first name"
                  className="h-10 md:h-12 text-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};