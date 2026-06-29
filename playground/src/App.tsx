import {
  CheckIcon,
  CopyIcon,
  // DownloadIcon,
  FilePlus2Icon,
  // PlusIcon,
  // QrCodeIcon,
  // RefreshCcwIcon,
  ShareIcon,
  TextAlignStartIcon,
  XIcon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  lazy,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FC,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// both of these methods import monaco indirectly, think about lazy loading these
import { storage } from "@/components/Editor/storage";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { getShareLink } from "@/components/Editor/share";
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ConfigValidationLabel } from "@/components/ConfigValidationLabel";
import { GenerateLinkButton, ImportFromLinkButton } from "@/components/GenerateLinkButton";

const Editor = lazy(() => import("./components/Editor/Editor"));

const FileListItem: FC<
  {
    name: string;
    fileId: string;
    isActive?: boolean;
    icon?: ReactNode;
    fontSize?: "sm" | "md";
    initialState?: "new" | "static";
    onNameChanged?: (name: string | null) => void;
  } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  name,
  icon,
  fileId,
  isActive,
  fontSize,
  className,
  initialState,
  onNameChanged,
  ...props
}) => {
  const [isRenaming, setIsRenaming] = useState(initialState === "new");

  return (
    <button
      className={cn(
        "flex pl-3 pr-1 py-1.25 items-center gap-1.5 outline-0!",
        "h-[30px] [&>svg]:min-w-[14px]",
        "hover:bg-[#212121]",
        {
          "text-white bg-[#2b2b2b]! z-99": isActive,
          "text-[#ccc] z-1": !isActive,
          "text-sm": fontSize === "md",
          "text-xs": fontSize !== "md",
          "py-0.75": isRenaming,
        },
        className,
      )}
      {...props}
      ref={(el) => {
        if (el) {
          el.addEventListener("keyup", (e) => {
            if (e.key === "Backspace" || e.key === "Delete") {
              storage.deleteFile(fileId);
            } else if (e.key === "Enter") {
              setIsRenaming(true);
            }
          });
        }
      }}
    >
      {icon}
      {isRenaming && (
        <input
          defaultValue={name}
          className="bg-white/5 rounded-xs -ml-1 w-full h-full py-0.75 px-1 text-sm focus-visible:outline-1 outline-white/20"
          ref={(el) => {
            if (el) {
              el.focus();
              if (initialState === "new") {
                el.setSelectionRange(0, 0);
              } else {
                const lastDotIndex = el.value.lastIndexOf(".") || el.value.length;
                el.setSelectionRange(0, lastDotIndex);
              }
              let submitted = false;
              const submitName = () => {
                if (submitted) return;
                onNameChanged?.(el.value);
                setIsRenaming(false);
                submitted = true;
              };
              const cancel = () => {
                if (submitted) return;
                onNameChanged?.(null);
                setIsRenaming(false);
                submitted = true;
              };
              el.addEventListener("blur", () => {
                submitName();
              });
              el.addEventListener("keyup", (e) => {
                if (e.key === "Enter") submitName();
                if (e.key === "Escape") cancel();
                e.stopPropagation();
                e.preventDefault();
              });
            }
          }}
        />
      )}
      {!isRenaming && <span onDoubleClick={() => setIsRenaming(true)}>{name}</span>}
    </button>
  );
};

const Tabs = () => {
  const [files, setFiles] = useState(storage.getOpenFiles());
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<number>(null!);
  useEffect(() => {
    return storage.on("files:list:opens", setFiles);
  }, []);

  useEffect(() => {
    function scrollTabIntoView(activeTab: HTMLElement) {
      activeTab?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    }
    const activeTab = document.getElementById(`tab-${storage.getActiveFileId()}`);
    scrollTabIntoView(activeTab);
  }, [files]);

  const copyLink = () => {
    if (copyTimeout.current) clearTimeout(copyTimeout.current);

    navigator.clipboard
      .writeText(getShareLink(storage.getFile(storage.getActiveFileId())))
      .then(() => {
        setCopied(true);
        copyTimeout.current = window.setTimeout(() => {
          setCopied(false);
        }, 1500);
      });
  };

  if (!files.length) return null;
  return (
    <div
      id="tabs-container"
      className="bg-[#181818] border-b border-[#2B2B2D] h-[42px] flex justify-between overflow-y-hidden overflow-x-auto no-scrollbar"
    >
      <div className="flex grow h-[42px]">
        {files.map((file) => {
          return (
            <div
              key={file.id}
              id={`tab-${file.id}`}
              className={cn(
                "cursor-pointer select-none flex gap-2 justify-between w-fit items-center px-2 border-r border-r-[#2B2B2D]",
                {
                  "bg-[#121212] border-b border-b-[#121212] pb-[1px] h-[44px]": file.isActive,
                  "bg-transparent hover:bg-white/2": !file.isActive,
                },
              )}
              onAuxClick={(e) => {
                if (e.button === 1) storage.closeFile(file.id);
              }}
              onClick={(e) => {
                if (e.button === 0) storage.openFile(file.id, undefined, true);
              }}
            >
              <div className="flex gap-2 text-[#ccc] text-sm items-center truncate">
                <TextAlignStartIcon size="14" className="text-[#75767c]" />
                <span>{file.name}</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-sm w-fit h-fit p-1 hover:bg-white/8"
                onClick={(e) => {
                  storage.closeFile(file.id);
                  e.stopPropagation();
                }}
              >
                <XIcon size="14" className="text-neutral-400" />
              </Button>
            </div>
          );
        })}
      </div>
      <div className="pr-2 h-full flex items-center">
        {/* <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon"
                variant="ghost"
                className="rounded-sm w-fit h-fit p-1.5 hover:bg-white/8"
              >
                <DownloadIcon size="18" className="text-neutral-400" />
              </Button>
            }
          />
          <TooltipContent>Download</TooltipContent>
        </Tooltip> */}
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" size="sm">
                <ShareIcon /> Share
              </Button>
            }
          />
          <PopoverContent className="gap-2">
            <div className="flex flex-col gap-1">
              Share config as
              <Input
                ref={(el) => {
                  if (el) {
                    el.value = storage.getFile(storage.getActiveFileId()).name;
                  }
                }}
              />
            </div>
            <Button className="w-full" autoFocus onClick={copyLink}>
              {copied && <CheckIcon />}
              {copied && "Copied"}
              {!copied && <CopyIcon />}
              {!copied && "Copy link"}
            </Button>
            <span className="text-muted-foreground">
              Config is encoded directly in the share link and nothing is sent to any server.
            </span>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

const FilesSidebar = () => {
  const [files, setFiles] = useState(storage.getFiles());
  const [isCreatingNewFile, setIsCreatingNewFile] = useState(false);
  const sidebar = useSidebar();

  useEffect(() => {
    return storage.on("files:list", setFiles);
  }, []);

  return (
    <Sidebar className="mt-[50px]">
      <div className="select-none flex h-full gap-1 flex-col bg-[#181818]">
        <div className=" flex flex-col border-b border-[#2B2B2D]">
          <div className="relative flex items-center justify-between pl-3 pr-2 h-[41px]">
            <span className="uppercase text-[10px] tracking-widest text-neutral-400">configs</span>
            <ImportFromLinkButton />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute rounded-sm right-7 w-fit h-fit p-1 hover:bg-white/8 text-neutral-400"
                    onClick={() => setIsCreatingNewFile(true)}
                  >
                    <FilePlus2Icon size="14" />
                  </Button>
                }
              />
              <TooltipContent>New file</TooltipContent>
            </Tooltip>
            <SidebarTrigger
              size="icon"
              variant="ghost"
              className="absolute rounded-sm right-1 w-fit h-fit p-1 hover:bg-white/8 text-neutral-400"
            />
          </div>
          {files.map((file) => {
            return (
              <FileListItem
                key={file.id}
                fileId={file.id}
                name={file.name}
                fontSize="md"
                icon={<TextAlignStartIcon size="14" className="text-[#75767c]" />}
                isActive={file.isActive}
                onClick={() => {
                  if (sidebar.isMobile && sidebar.openMobile) sidebar.toggleSidebar();
                  storage.openFile(file.id);
                }}
                onNameChanged={(name) => {
                  if (name) {
                    storage.renameFile(file.id, name);
                  }
                }}
              >
                {file.name}
              </FileListItem>
            );
          })}
          {isCreatingNewFile && (
            <FileListItem
              fileId="new-file"
              name=".json"
              fontSize="md"
              icon={<TextAlignStartIcon size="14" className="text-[#75767c]" />}
              initialState="new"
              onNameChanged={(name) => {
                if (name && name.length && name !== ".json") {
                  storage.newFile(name);
                }
                setIsCreatingNewFile(false);
              }}
            ></FileListItem>
          )}
        </div>
      </div>
    </Sidebar>
  );
};
function SidebarButton() {
  const sidebar = useSidebar();
  return (
    <SidebarTrigger
      size="icon"
      variant="ghost"
      className={cn("rounded-sm right-1 w-fit h-fit p-1 hover:bg-white/8 text-neutral-400", {
        "-ml-7.5": (sidebar.isMobile && sidebar.openMobile) || (!sidebar.isMobile && sidebar.open),
      })}
    />
  );
}
function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex flex-col h-screen w-full max-w-screen overflow-hidden">
          <div className="flex items-center gap-2 py-3 px-3 bg-[#181818] justify-between border-b border-[#2B2B2D]">
            <div className="flex gap-1 items-center">
              <SidebarButton />
              <span className="font-light text-sm text-white">Xray-Schema Playground</span>
            </div>
            <div className="-mr-1">
              <Button variant="outline" size="sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-github"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                </svg>
                Github
              </Button>
            </div>
          </div>
          <div className="flex h-[calc(100%-50px)]">
            <FilesSidebar />
            {/* <div className="flex flex-col gap-0.5 py-1 pt-2 pb-2">
              <span className="px-3 pb-[3px] uppercase text-[10px] tracking-widest text-neutral-400">
                tools
              </span>
              <SidebarButton icon={<RefreshCcwIcon size="14" className="text-[#75767c]" />}>
                Gen UUID
              </SidebarButton>
              <SidebarButton icon={<QrCodeIcon size="14" className="text-[#75767c]" />}>
                Share QR
              </SidebarButton>
            </div> */}
            <div className="flex flex-col grow h-full w-fit overflow-hidden">
              <Tabs />
              <Editor />
              <div className="px-1 py-1 bg-[#181818] border-t border-[#2B2B2D] flex justify-end w-full gap-1">
                <GenerateLinkButton />
                <ConfigValidationLabel />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default App;
