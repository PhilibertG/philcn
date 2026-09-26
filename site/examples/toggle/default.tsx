import { Toggle } from "@philcn/components/ui/toggle.tsx";

export default function ToggleDefault() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Bold">
        <span className="font-bold">B</span>
      </Toggle>
      <Toggle variant="outline" aria-label="Italic">
        <span className="italic">I</span>
      </Toggle>
      <Toggle defaultPressed aria-label="Underline">
        <span className="underline">U</span>
      </Toggle>
    </div>
  );
}
