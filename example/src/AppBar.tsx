import { buttonVariants } from "@/components/ui/button";
import { GitFork } from "lucide-react";

export const AppBar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-md font-medium tracking-tight text-foreground">
            @gozargah/xray-schema
          </h1>
          {/* <span className="hidden text-xs text-muted-foreground sm:inline">@gozargah/xray-schema</span> */}
        </div>
        <a
          href="https://github.com/gozargah/xray-schema"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <GitFork />
          GitHub
        </a>
      </div>
    </header>
  );
};
