import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const formSchema = z.object({
  partnerName: z.string().min(1, "Partner's name is required"),
  partnerEmail: z.string().email("Invalid email address"),
});

interface PartnerInformationProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: () => void;
}

export const PartnerInformation = ({
  form,
  onSubmit,
}: PartnerInformationProps) => {
  const [partnerRole, setPartnerRole] = useState<"bride" | "groom" | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-2xl text-center text-gray-700 mb-8">My partner is...</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card
            className={`cursor-pointer transition-all transform hover:scale-105 duration-200 ${
              partnerRole === "bride"
                ? "border-wedding-pink ring-2 ring-wedding-pink shadow-lg"
                : "hover:border-wedding-pink/50 hover:shadow-md"
            }`}
            onClick={() => setPartnerRole("bride")}
          >
            <CardContent className="p-0">
              <div className="w-full aspect-square">
                <img
                  src="/lovable-uploads/b39f9b88-9c30-47ca-9783-bb68659f8de4.png"
                  alt="Bride"
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all transform hover:scale-105 duration-200 ${
              partnerRole === "groom"
                ? "border-wedding-pink ring-2 ring-wedding-pink shadow-lg"
                : "hover:border-wedding-pink/50 hover:shadow-md"
            }`}
            onClick={() => setPartnerRole("groom")}
          >
            <CardContent className="p-0">
              <div className="w-full aspect-square">
                <img
                  src="/lovable-uploads/6b14a633-f382-4acb-8ce5-eb601bdf3075.png"
                  alt="Groom"
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <FormField
          control={form.control}
          name="partnerName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Your partner's first name"
                  className="h-12 text-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="partnerEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Your partner's email"
                  type="email"
                  className="h-12 text-lg"
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