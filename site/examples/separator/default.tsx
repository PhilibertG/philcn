import { Separator } from "@philcn/components/ui/separator.tsx";

export default function SeparatorDefault() {
  return (
    <div className="grid gap-4 text-sm">
      <div>
        <p className="font-medium">philcn</p>
        <p className="text-muted-foreground">A component library, written by hand.</p>
      </div>
      <Separator />
      <div className="flex h-5 items-center gap-4">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
        <Separator orientation="vertical" />
        <span>npm</span>
      </div>
    </div>
  );
}
