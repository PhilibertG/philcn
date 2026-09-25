import { Button } from "@philcn/components/ui/button.tsx";

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
