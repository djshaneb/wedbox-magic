import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, UserPlus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const AdminAccessDialog = () => {
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const queryClient = useQueryClient();

  const { data: partnerAccess, isLoading } = useQuery({
    queryKey: ["partnerAccess"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) throw new Error("No user session");

      const { data, error } = await supabase
        .from("partner_access")
        .select("*")
        .eq("user_id", session.session.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const addPartnerMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) throw new Error("No user session");

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            role: "admin",
          },
        },
      });
      
      if (error) throw error;

      const { error: insertError } = await supabase
        .from("partner_access")
        .insert({
          partner_email: email,
          user_id: session.session.user.id
        });
      
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      toast.success("Partner access invitation sent");
      setNewPartnerEmail("");
      queryClient.invalidateQueries({ queryKey: ["partnerAccess"] });
    },
    onError: (error) => {
      toast.error("Failed to add partner access: " + error.message);
    },
  });

  const removePartnerMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) throw new Error("No user session");

      const { error } = await supabase
        .from("partner_access")
        .delete()
        .eq("partner_email", email)
        .eq("user_id", session.session.user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Partner access removed");
      queryClient.invalidateQueries({ queryKey: ["partnerAccess"] });
    },
    onError: (error) => {
      toast.error("Failed to remove partner access: " + error.message);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          Admin Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Admin Access</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Current Admin Access</h3>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : partnerAccess?.length === 0 ? (
              <div className="text-sm text-muted-foreground">No partner admin access granted yet</div>
            ) : (
              <ul className="space-y-2">
                {partnerAccess?.map((access) => (
                  <li key={access.id} className="flex items-center justify-between gap-2 text-sm">
                    <span>{access.partner_email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePartnerMutation.mutate(access.partner_email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Add Partner Admin Access</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Partner's email"
                value={newPartnerEmail}
                onChange={(e) => setNewPartnerEmail(e.target.value)}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (newPartnerEmail) {
                    addPartnerMutation.mutate(newPartnerEmail);
                  }
                }}
                disabled={!newPartnerEmail || addPartnerMutation.isPending}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};