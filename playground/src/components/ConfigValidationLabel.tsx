import { CheckIcon } from "lucide-react";
import { debounce } from "es-toolkit";
import { useEffect, useState } from "react";
import { xraySchema } from "@gozargah/xray-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type z from "zod";

export const ConfigValidationLabel = () => {
  const [verification, setVerification] = useState<{
    status: "invalid" | "valid";
    errors?: Record<string, string>;
  }>({
    status: "valid",
  });

  useEffect(() => {
    if (window.monaco) {
      const onChange = debounce(() => {
        const model = window.monaco?.getModel();
        if (model) {
          const content = model.getLinesContent().join("\n");
          try {
            const json = JSON.parse(content);
            const zodParse = xraySchema.safeParse(json);
            if (zodParse.success) {
              return setVerification({ status: "valid", errors: undefined });
            } else if (zodParse.success === false) {
              const errors: Record<string, string> = {};
              const prettifyErrors = (issues: z.ZodIssue[], path?: string) => {
                issues.forEach((issue) => {
                  const currentPath =
                    issue.path && issue.path.length
                      ? path
                        ? `${path}.${issue.path.join(".")}`
                        : issue.path.join(".")
                      : path;

                  if (Array.isArray(issue)) {
                    issue.forEach(() => {
                      prettifyErrors(issue, currentPath);
                    });
                    return;
                  }
                  errors[currentPath] = issue.message;
                  if ((issue as unknown as { errors: z.ZodIssue[] }).errors) {
                    prettifyErrors(
                      (issue as unknown as { errors: z.ZodIssue[] }).errors,
                      currentPath,
                    );
                  }
                });
              };
              prettifyErrors(zodParse.error.issues);
              return setVerification({ status: "invalid", errors });
            }
          } catch (e) {
            console.log(e);
            setVerification({ status: "invalid", errors: { "": "Invalid JSON" } });
          }
        }
      }, 500);
      onChange();
      const subModelChange = window.monaco?.onDidChangeModelContent(onChange);
      return subModelChange.dispose.bind(subModelChange);
    }
  }, []);
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn("flex items-center gap-1 text-xs font-light w-fit", {
              "text-green-500!": verification.status === "valid",
              "text-red-500!": verification.status === "invalid",
            })}
          >
            <CheckIcon size="12" />
            {verification.status === "valid" ? "valid" : "invalid"}
          </Button>
        }
      />
      <PopoverContent
        side="top"
        align="center"
        sideOffset={10}
        className="w-90 min-h-50 max-h-100 overflow-auto"
      >
        <div className="flex flex-col gap-1">
          {verification.status === "invalid" && (
            <>
              <span className="text-red-500 text-sm">Errors:</span>
              <ul className="list-disc list-inside text-xs">
                {Object.entries(verification.errors)?.map(([path, message], index) => (
                  <li key={index} className="flex flex-col gap-1 mb-4">
                    <span className="font-medium font-mono text-muted-foreground">
                      <span className="text-white">•</span> {path}:
                    </span>{" "}
                    <span className="pl-4 inline-block">{message}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {verification.status === "valid" && (
            <div className="text-green-500 text-sm flex gap-1 items-center">
              <CheckIcon size={16} />
              No errors found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
