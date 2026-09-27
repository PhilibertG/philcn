import { ToggleGroup, ToggleGroupItem } from "@philcn/components/ui/toggle-group.tsx";

/** Any number of them at once; the value is an array. */
export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup type="multiple" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <span className="font-bold">B</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <span className="italic">I</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <span className="underline">U</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
