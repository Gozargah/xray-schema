export const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Built for developers shipping panels, clients, and automation around Xray/V2Ray.</p>
          <p className="font-mono">@gozargah/xray-schema</p>
        </div>
      </div>
    </footer>
  );
};
