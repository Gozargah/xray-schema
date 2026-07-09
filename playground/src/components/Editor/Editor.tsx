import { useEffect, useRef, useState } from "react";
import { monaco, jsonDefaults } from "./monaco";
import { settings } from "./settings";
import { storage } from "@/components/Editor/storage";
import { debounce } from "es-toolkit";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { loadShareLink } from "./share";

const initHighlighter = async () => {
  await Promise.all([import("./shiki"), import("@shikijs/monaco")]).then(([shiki, shikiMonaco]) => {
    // @ts-expect-error shiki is not fully compatible with monaco-editor typings
    shikiMonaco.shikiToMonaco(shiki.highlighter, monaco);
  });
};
await initHighlighter();

const schema = await import("@gozargah/xray-schema/full/schema.json").then((mod) => mod.default);

export default function Editor() {
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isAnyFileOpen, setIsAnyFileOpen] = useState(!!storage.getOpenFiles().length);

  useEffect(() => {
    return storage.on("files:list:opens", (files) => {
      setIsAnyFileOpen(!!files.length);
    });
  }, []);

  useEffect(() => {
    jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: "app://schema.json",
          fileMatch: ["*"],
          schema,
        },
      ],
    });
    const model = storage.getActiveModel();
    monacoRef.current = monaco.editor.create(document.getElementById("editor")!, {
      model,
      ...settings.load(),
    });
    window.monaco = monacoRef.current;
    storage.initializeViewState();
    const editor = monacoRef.current;
    monacoRef.current.restoreViewState(JSON.parse(localStorage.getItem("viewState")!));

    setTimeout(initHighlighter, 50);

    // disposable
    monacoRef.current.onDidPaste(() => {
      const model = monacoRef.current.getModel();
      if (!model) return;
      monacoRef.current.getAction("editor.action.formatDocument")?.run();
    });
    // disposable
    monacoRef.current.onDidChangeConfiguration(() => {
      settings.save({
        fontSize: editor.getOption(monaco.editor.EditorOption.fontSize),
        wordWrap: editor.getOption(monaco.editor.EditorOption.wordWrap),
        lineHeight: editor.getOption(monaco.editor.EditorOption.lineHeight),
        fontFamily: editor.getOption(monaco.editor.EditorOption.fontFamily),
      });
    });
    const attachModelListener = () => {
      // disposable
      editor.getModel()?.onDidChangeOptions(() => {
        settings.save({
          tabSize: editor.getModel()?.getOptions().tabSize ?? 4,
        });
      });
      editor.getModel()?.onDidChangeContent(
        debounce(() => {
          storage.saveActiveFileContent();
        }, 100),
      );
    };
    attachModelListener();
    // disposable
    monacoRef.current.onDidChangeModel(attachModelListener);
    monacoRef.current.focus();
    // disposable
    window.addEventListener("beforeunload", () => {
      storage.saveActiveFileContent();
    });
    setTimeout(() => {
      const file = loadShareLink();
      if (file instanceof Error) {
        console.error(file);
      } else if (file) {
        storage.newFile(file);
      }
    }, 200);
    return () => monacoRef.current?.dispose();
  }, []);

  return (
    <div className="w-full h-full relative">
      {!isAnyFileOpen && (
        <div className="z-40 absolute top-0 left-0 h-full w-full grow bg-[#121212] flex justify-center items-center flex-col gap-1">
          <span className="font-medium">Xray config editor</span>
          <p className="text-sm text-muted-foreground">
            Create a new config or start from a snippet below
          </p>
          <Button className="mt-4" variant="outline" onClick={() => storage.newFile("config.json")}>
            <Plus size="14" />
            New config
          </Button>
          <div className="text-muted-foreground text-xs border-b h-2.25 min-w-xs text-center mt-4">
            <span className="bg-[#121212] px-2">or start from a snippet</span>
          </div>
          <div className="text-muted-foreground text-xs mt-4">Snippets soon...</div>
        </div>
      )}
      <div id="editor" className="h-full w-full grow bg-[#121212] relative z-30" />
    </div>
  );
}
