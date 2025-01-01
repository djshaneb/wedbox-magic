import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

interface PartnerListProps {
  isLoading: boolean;
  partnerAccess: any[] | null;
  removePartnerMutation: UseMutationResult<void, Error, string, unknown>;
}

export const PartnerList = ({ isLoading, partnerAccess, removePartnerMutation }: PartnerListProps) => {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (!partnerAccess || partnerAccess.length === 0) {
    return <div className="text-sm text-muted-foreground">No partner admin access granted yet</div>;
  }

  return (
    <ul className="space-y-2">
      {partnerAccess.map((access) => (
        <li key={access.id} className="flex items-center justify-between gap-2 text-sm">
          <span>{access.partner_name} ({access.partner_email})</span>
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
  );
};