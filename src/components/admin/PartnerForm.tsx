import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

interface PartnerFormProps {
  newPartnerEmail: string;
  setNewPartnerEmail: (email: string) => void;
  hasExistingPartner: boolean;
  addPartnerMutation: UseMutationResult<void, Error, string, unknown>;
}

export const PartnerForm = ({
  newPartnerEmail,
  setNewPartnerEmail,
  hasExistingPartner,
  addPartnerMutation,
}: PartnerFormProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">
        Give Partner Admin Access
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
  );
};