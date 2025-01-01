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
      console.log("Fetching partner access...");
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) {
        console.error("No user session found");
        throw new Error("No user session");
      }

      const { data, error } = await supabase
        .from("partner_access")
        .select("*")
        .or(`user_id.eq.${session.session.user.id},partner_email.eq.${session.session.user.email}`);
      
      if (error) {
        console.error("Error fetching partner access:", error);
        throw error;
      }
      console.log("Partner access data:", data);
      return data;
    },
  });

  const addPartnerMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) throw new Error("No user session");

      const { error: insertError } = await supabase
        .from("partner_access")
        .insert({
          partner_email: email,
          user_id: session.session.user.id
        });
      
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      toast.success("Partner access granted");
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

  const hasExistingPartner = partnerAccess && partnerAccess.length > 0;

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
            ) : !partnerAccess || partnerAccess.length === 0 ? (
              <div className="text-sm text-muted-foreground">No partner admin access granted yet</div>
            ) : (
              <ul className="space-y-2">
                {partnerAccess.map((access) => (
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
            <h3 className="text-sm font-medium mb-2">
              {hasExistingPartner 
                ? `Give ${partnerAccess[0].partner_email} Admin Access`
                : "Give Partner Admin Access"}
            </h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Partner's email"
                value={newPartnerEmail}
                onChange={(e) => setNewPartnerEmail(e.target.value)}
                disabled={hasExistingPartner}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (newPartnerEmail) {
                    addPartnerMutation.mutate(newPartnerEmail);
                  }
                }}
                disabled={!newPartnerEmail || addPartnerMutation.isPending || hasExistingPartner}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            {hasExistingPartner && (
              <p className="text-sm text-muted-foreground mt-2">
                You can only have one partner with admin access
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};