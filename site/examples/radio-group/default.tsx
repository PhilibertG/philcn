import { Label } from "@philcn/components/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "@philcn/components/ui/radio-group.tsx";

/** Tab enters the group once; the arrow keys move between the choices. */
export default function RadioGroupDefault() {
  return (
    <RadioGroup defaultValue="npm" className="grid gap-3">
      {["npm", "pnpm", "bun"].map((manager) => (
        <div key={manager} className="flex items-center gap-3">
          <RadioGroupItem value={manager} id={manager} />
          <Label htmlFor={manager}>{manager}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
