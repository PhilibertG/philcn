import { Input } from "@philcn/components/ui/input.tsx";

/** `aria-invalid` is what colours a field wrong — not a class you add. */
export default function InputStates() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="Ordinary" />
      <Input placeholder="Disabled" disabled />
      <Input defaultValue="not-an-email" aria-invalid />
      <Input type="file" />
    </div>
  );
}
