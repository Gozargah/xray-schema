import type { monaco } from "@/components/Editor/monaco";
import type { DiagnosticsOptions } from "monaco-json";

declare module "monaco-editor-core" {
  namespace languages {
    namespace json {
      const jsonDefaults: {
        setDiagnosticsOptions(options: DiagnosticsOptions): void;
        readonly diagnosticsOptions: DiagnosticsOptions;
      };
    }
  }
}

declare global {
  // Note the capital "W"
  interface Window {
    monaco: monaco.editor.IStandaloneCodeEditor;
  }
}
