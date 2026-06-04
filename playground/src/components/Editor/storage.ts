import { monaco } from "@/components/Editor/monaco";
import { createHooks } from "hookable";

const FILES_KEY = "xray-schema-files";
const VIEW_STATE_KEY = "xray-schema-files-view-state";

export interface PersistedFile {
  id: string;
  name: string;
  path: string;
  content: string;
  isActive: boolean;
  isOpen: boolean;
}

const getDefaultFile = (): PersistedFile => ({
  id: crypto.randomUUID(),
  name: "config.json",
  path: "/config.json",
  content: JSON.stringify(
    {
      log: {
        loglevel: "info",
      },
      inbounds: [
        {
          listen: "127.0.0.1",
          port: "7890",
          protocol: "socks",
          settings: {
            auth: "noauth",
            udp: true,
          },
        },
      ],
      outbounds: [],
    },
    null,
    4,
  ),
  isActive: true,
  isOpen: true,
});

class Storage {
  private _files: Record<string, PersistedFile> = {};
  private _models: Record<string, monaco.editor.ITextModel> = {};
  private _viewStates: Record<string, monaco.editor.ICodeEditorViewState> = {};
  private _activeFileId: string = "";
  private _opennedFiles: PersistedFile[];
  private _mru: string[] = [];
  private storageHooks = createHooks<{
    "file:changed": (model: monaco.editor.ITextModel) => void;
    "files:list": (files: PersistedFile[]) => void;
    "files:list:opens": (files: PersistedFile[]) => void;
  }>();
  constructor() {
    this._files = this.loadFiles();
    this._viewStates = this.loadViewStates();
    const files = Object.values(this._files);
    this._opennedFiles = files.filter((f) => f.isOpen);
    const activeFile = files.find((f) => f.isActive) || files[0];
    if (activeFile) {
      this._activeFileId = activeFile.id;
      if (activeFile) {
        this._models[activeFile.id] = monaco.editor.createModel(
          activeFile.content,
          "json",
          monaco.Uri.parse(`file:///${activeFile.id}`),
        );
      }
    }
  }
  getFiles() {
    return Object.values(this._files);
  }
  getOpenFiles() {
    return this._opennedFiles;
  }
  getFile(fileId) {
    return this._files[fileId];
  }
  getActiveFileId() {
    return this._activeFileId;
  }
  getActiveModel() {
    return this._models[this._activeFileId];
  }
  private loadFiles(): Record<string, PersistedFile> {
    try {
      return JSON.parse(localStorage.getItem(FILES_KEY) ?? "{}");
    } catch {
      return {};
    }
  }
  private loadViewStates(): Record<string, monaco.editor.ICodeEditorViewState> {
    try {
      return JSON.parse(localStorage.getItem(VIEW_STATE_KEY) ?? "{}");
    } catch {
      return {};
    }
  }
  save() {
    localStorage.setItem(FILES_KEY, JSON.stringify(this._files));
    localStorage.setItem(VIEW_STATE_KEY, JSON.stringify(this._viewStates));
  }
  saveActiveFileContent() {
    const model = monaco.editor.getModel(monaco.Uri.parse(`file:///${this._activeFileId}`));
    const content = model.getValue();
    this._files[this._activeFileId].content = content;
    this._viewStates[this._activeFileId] = window.monaco.saveViewState();
    this.save();
  }
  openFile(fileId: string, monacoInstance: monaco.editor.IStandaloneCodeEditor = window.monaco) {
    if (fileId !== this._activeFileId) {
      if (this._files[this._activeFileId]) {
        this._files[this._activeFileId].isActive = false;
      }
      if (this._files[fileId]) {
        const file = this._files[fileId];
        file.isActive = true;

        if (!this._models[fileId])
          this._models[fileId] = monaco.editor.createModel(
            file.content,
            "json",
            monaco.Uri.parse(`file:///${file.id}`),
          );

        // store prev view state
        const viewState = monacoInstance.saveViewState();
        this._viewStates[this._activeFileId] = viewState;

        monacoInstance.setModel(this._models[fileId]);
        // restore active file view state
        const prevViewState = this._viewStates[fileId];
        if (prevViewState) {
          monacoInstance.restoreViewState(prevViewState);
        }

        if (!this._files[fileId].isOpen) {
          this._files[fileId].isOpen = true;
          this._opennedFiles.push(this._files[fileId]);
        }

        if (!this._opennedFiles.find((f) => f.id === fileId)) {
          this._opennedFiles.push(this._files[fileId]);
        }
        // fill mru with prev active file
        this._mru = [fileId, ...this._mru.filter((x) => x !== fileId)];
        this._activeFileId = fileId;
        this.storageHooks.callHook("file:changed", this._models[fileId]!);
        this.storageHooks.callHook("files:list", this.getFiles());
        this.storageHooks.callHook("files:list:opens", [...this._opennedFiles]);
        // window.monaco.focus();
      }
    }
    this.save();
  }
  initializeViewState() {
    if (this._activeFileId && this._viewStates[this._activeFileId])
      window.monaco.restoreViewState(this._viewStates[this._activeFileId]);
  }
  closeFile(fileId: string) {
    if (this._files[fileId]) this._files[fileId].isOpen = false;
    const fileIndex = this._opennedFiles.findIndex((f) => f.id === fileId);
    if (fileIndex !== -1) {
      this._opennedFiles.splice(fileIndex, 1);
    }
    this.storageHooks.callHook("files:list:opens", [...this._opennedFiles]);

    const viewState = window.monaco.saveViewState();
    this._viewStates[fileId] = viewState;

    this.save();

    this._mru = this._mru.filter((x) => x !== fileId);

    if (fileId === this._activeFileId) {
      this._files[this._activeFileId].isActive = false;
      this._activeFileId = "";
      const prevOpenFileId = this._mru[0];
      if (prevOpenFileId) {
        this.openFile(prevOpenFileId);
      } else {
        window.monaco.setModel(null);
        this.storageHooks.callHook("files:list", this.getFiles());
      }
    }
  }

  newFile(fileNameOrFile?: string | PersistedFile) {
    let file;
    if (typeof fileNameOrFile === "string") {
      file = getDefaultFile();
      file.name = fileNameOrFile;
    } else {
      file = fileNameOrFile;
    }
    this._files[file.id] = file;
    this.openFile(file.id);
    this.save();
  }
  renameFile(fileId: string, name: string) {
    this._files[fileId].name = name;
    if (this._files[fileId].isOpen) {
      const openFileObj = this._opennedFiles.find((f) => f.id === fileId);
      openFileObj.name = name;
      this.storageHooks.callHook("files:list:opens", this.getFiles());
    }
    this.save();
    this.storageHooks.callHook("files:list", this.getFiles());
  }
  deleteFile(fileId: string) {
    delete this._files[fileId];
    delete this._viewStates[fileId];
    this.save();
    this.storageHooks.callHook("files:list", this.getFiles());
    this._mru = this._mru.filter((id) => id !== fileId);
    this._opennedFiles = this._opennedFiles.filter((f) => f.id !== fileId);
    this.storageHooks.callHook("files:list:opens", [...this._opennedFiles]);
  }
  on = this.storageHooks.hook;
}

export const storage = new Storage();
