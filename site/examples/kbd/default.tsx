import { Kbd, KbdGroup } from "@philcn/components/ui/kbd.tsx";

export default function KbdDefault() {
  return (
    <div className="grid gap-3 text-center text-sm">
      <p>
        Open the palette with <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
      </p>
      <p>
        Undo with <KbdGroup><Kbd>Ctrl</Kbd><Kbd>Z</Kbd></KbdGroup>
      </p>
    </div>
  );
}
