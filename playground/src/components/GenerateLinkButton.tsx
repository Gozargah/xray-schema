import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LinkIcon, UnlinkIcon } from "lucide-react";
import { useState } from "react";
import { parseLink } from "@gozargah/xray-schema/link";
import { storage } from "@/components/Editor/storage";

export const ImportFromLinkButton = () => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const inputValue = (document.querySelector('input[name="link"]') as HTMLInputElement).value;
    try {
      const outbound = await parseLink(inputValue);
      const json = JSON.stringify(
        {
          outbounds: [outbound],
        },
        null,
        2,
      );
      storage.newFile((outbound.tag || "imported") + ".json", json);
      setError(null);
    } catch {
      setError("Invalid link");
    }
  };
  return (
    <Tooltip>
      <Popover>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute rounded-sm right-13 w-fit h-fit p-1 hover:bg-white/8 text-neutral-400"
                >
                  <UnlinkIcon size="14" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Import V2ray link</TooltipContent>
        <PopoverContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <span className="text-white">Import V2ray link</span>
            <Input name="link" placeholder="vless://..." />
            {error && <span className="text-red-500">{error}</span>}
            <Button type="submit">Import</Button>
          </form>
        </PopoverContent>
      </Popover>
    </Tooltip>
  );
};

export const GenerateLinkButton = () => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="opacity-80 hover:opacity-100 active:opacity-100 focus:opacity-100"
          >
            <LinkIcon /> Generate V2ray Link
          </Button>
        }
      />
      <PopoverContent sideOffset={10} side="top">
        Not implemented
      </PopoverContent>
    </Popover>
  );
};
