import { storage, type PersistedFile } from "@/components/Editor/storage";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

export const getShareLink = (file: PersistedFile): string => {
  const url = new URL(window.location.toString());
  url.search = `?import=${compressToEncodedURIComponent(JSON.stringify({ name: file.name, content: file.content }))}`;
  return url.toString();
};

function resolveIncoming(incoming: Pick<PersistedFile, "name" | "content">): PersistedFile {
  const existing = storage.getFiles();

  const takenNames = new Set(existing.map((f) => f.name));
  let name = incoming.name;
  let counter = 1;
  const nameWithoutExt = incoming.name.substring(0, incoming.name.lastIndexOf("."));
  const ext = incoming.name.substring(incoming.name.lastIndexOf("."), incoming.name.length);
  while (takenNames.has(name)) {
    name = `${nameWithoutExt}_${counter++}${ext}`;
  }

  return {
    ...incoming,
    name,
    id: crypto.randomUUID(),
    path: `/${name}`,
    isActive: true,
    isOpen: true,
  };
}

export const loadShareLink = (): PersistedFile | Error | null => {
  const url = new URL(window.location.toString());
  const searchParams = new URLSearchParams(url.search);
  const importParam = searchParams.get("import");
  if (importParam) {
    try {
      const dec = decompressFromEncodedURIComponent(importParam);
      const data = JSON.parse(dec);
      const endFile = resolveIncoming(data);
      const newUrl = new URL(window.location.toString());
      newUrl.search = "";
      window.history.replaceState(null, "", newUrl.toString());
      return endFile;
    } catch {
      return new Error("Invalid share link");
    }
  }
  return null;
};
