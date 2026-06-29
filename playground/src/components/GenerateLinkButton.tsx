import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";

export const GenerateLinkButton = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="opacity-80 hover:opacity-100 active:opacity-100 focus:opacity-100"
    >
      <LinkIcon /> Generate Link
    </Button>
  );
};
