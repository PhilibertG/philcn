import { ToggleGroup, ToggleGroupItem } from "@philcn/components/ui/toggle-group.tsx";

/** One of the three, like a radio group that looks like buttons. */
export default function ToggleGroupSingle() {
  return (
    <ToggleGroup type="single" defaultValue="center" variant="outline">
      <ToggleGroupItem value="left" aria-label="Align left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align centre">
        Centre
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
