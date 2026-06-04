import "zod";

declare module "zod" {
  interface GlobalMeta {
    markdownDescription?: string;
    deprecationMessage?: string;
    defaultSnippets?: {
      label: string;
      description: string;
      body: object;
    }[];
  }
}
