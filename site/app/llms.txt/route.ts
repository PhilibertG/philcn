import { docs, slugs } from "@/content/docs";
import { groups } from "@/content/registry";

/**
 * /llms.txt — the map an assistant reads first: what philcn is, and where the
 * Markdown of every written page lives.
 */
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    "# philcn",
    "",
    "> A React component library written from scratch, with an API deliberately compatible with shadcn/ui. Components are copied into your project by a CLI rather than installed as a package.",
    "",
    "Install the CLI's output with `npx philcn@latest add <component>`.",
    "",
    "## Documentation",
    "",
  ];

  for (const group of groups) {
    const written = group.items.filter((item) => slugs.includes(item.slug));
    if (written.length === 0) continue;
    lines.push(`### ${group.title}`, "");
    for (const item of written) {
      const doc = docs[item.slug];
      lines.push(`- [${item.title}](/docs/${item.slug}/markdown): ${doc?.summary ?? ""}`);
    }
    lines.push("");
  }

  return new Response(`${lines.join("\n").trimEnd()}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
