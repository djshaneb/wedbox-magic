import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useState } from "react";
import { PartnerList } from "./PartnerList";
import { PartnerForm } from "./PartnerForm";
import { usePartnerAccess } from "./hooks/usePartnerAccess";

export const AdminAccessDialog = () => {
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const { partnerAccess, isLoading, addPartnerMutation, removePartnerMutation } = usePartnerAccess();

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
            <PartnerList
              isLoading={isLoading}
              partnerAccess={partnerAccess}
              removePartnerMutation={removePartnerMutation}
            />
          </div>
          
          <PartnerForm
            newPartnerEmail={newPartnerEmail}
            setNewPartnerEmail={setNewPartnerEmail}
            hasExistingPartner={hasExistingPartner}
            addPartnerMutation={addPartnerMutation}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};