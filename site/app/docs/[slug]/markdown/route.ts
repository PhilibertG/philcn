import { docs, slugs } from "@/content/docs";
import { docToMarkdown } from "@/lib/markdown";

/**
 * The same page, as Markdown, at /docs/<component>/markdown.
 *
 * This is what the "Copy page" button copies and what an assistant is handed
 * when someone points it here.
 */
export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const doc = docs[(await params).slug];
  if (!doc) return new Response("Not found", { status: 404 });

  return new Response(docToMarkdown(doc), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
