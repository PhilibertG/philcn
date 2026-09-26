import { Checkbox } from "@philcn/components/ui/checkbox.tsx";
import { Label } from "@philcn/components/ui/label.tsx";

/**
 * `htmlFor` ties the label to the field: clicking the words focuses or ticks
 * it, and a screen reader reads them together.
 */
export default function LabelDefault() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Keep me signed in</Label>
    </div>
  );
}
