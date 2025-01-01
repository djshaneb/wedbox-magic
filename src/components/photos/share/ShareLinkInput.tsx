import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShareLinkInputProps {
  shareLink: string | null;
  isLoading: boolean;
}

export const ShareLinkInput = ({ shareLink, isLoading }: ShareLinkInputProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const onCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Input
        value={isLoading ? "Generating link..." : shareLink || ""}
        readOnly
        className="flex-1"
      />
      <Button
        size="icon"
        onClick={onCopy}
        disabled={!shareLink || isLoading}
        className="transition-all duration-200"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span className="sr-only">Copy link</span>
      </Button>
    </>
  );
};