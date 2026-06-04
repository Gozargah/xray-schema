import type { monaco } from "@/components/Editor/monaco";

const SETTINGS_KEY = "xray-editor-settings";

const DEFAULTS: monaco.editor.IStandaloneEditorConstructionOptions = {
  theme: "vitesse-dark",
  minimap: { enabled: false },
  padding: {
    top: 10,
    bottom: 10,
  },
  lineNumbersMinChars: 4.2,
  stickyScroll: {
    enabled: false,
  },
  automaticLayout: true,
  quickSuggestions: { other: true, comments: false, strings: true },
  suggest: { showWords: false },
};

type EditorSettings = typeof DEFAULTS;

export const settings = {
  load(): EditorSettings {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return { ...DEFAULTS, ...JSON.parse(saved ?? "{}") };
    } catch {
      return DEFAULTS;
    }
  },

  save(patch: Partial<EditorSettings>) {
    const current = this.load();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...patch }));
  },
};
