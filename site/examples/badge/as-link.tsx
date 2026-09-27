import { Badge } from "@philcn/components/ui/badge.tsx";

/** A badge that navigates keeps the badge's looks and becomes a real link. */
export default function BadgeAsLink() {
  return (
    <Badge asChild>
      <a href="https://www.npmjs.com/package/philcn">philcn on npm →</a>
    </Badge>
  );
}
