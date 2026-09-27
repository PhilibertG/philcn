import { Checkbox } from "@philcn/components/ui/checkbox.tsx";
import { Label } from "@philcn/components/ui/label.tsx";

export default function CheckboxDefault() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <Checkbox id="public" defaultChecked />
        <Label htmlFor="public">Public repository</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="issues" />
        <Label htmlFor="issues">Enable issues</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox id="wiki" disabled />
        <Label htmlFor="wiki" className="opacity-50">
          Wiki (unavailable)
        </Label>
      </div>
    </div>
  );
}
