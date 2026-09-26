import { Label } from "@philcn/components/ui/label.tsx";
import { Textarea } from "@philcn/components/ui/textarea.tsx";

export default function TextareaDefault() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="What changed in this release?" rows={4} />
    </div>
  );
}
