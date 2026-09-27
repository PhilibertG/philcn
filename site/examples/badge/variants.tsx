import { Badge } from "@philcn/components/ui/badge.tsx";

export default function BadgeVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}
