import { Button } from "@philcn/components/ui/button.tsx";

/**
 * The same button, rendered as a link. Both spellings are accepted: `asChild`
 * comes from blocks written against Radix, `render` from the current shadcn
 * documentation. They do the same thing.
 */
export default function ButtonAsLink() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button asChild>
        <a href="https://github.com/PhilibertG/philcn">With asChild</a>
      </Button>
      <Button variant="outline" render={<a href="https://www.npmjs.com/package/philcn" />}>
        With render
      </Button>
    </div>
  );
}
