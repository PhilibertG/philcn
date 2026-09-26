import type { Route } from "next";
import Link from "next/link";

import { slugs } from "@/content/docs";
import { groups } from "@/content/registry";

/**
 * The page before and the page after, named.
 *
 * The order is the sidebar's order, and only written pages count — walking
 * forward should never land on a page that does not exist yet.
 */
const order = groups
  .flatMap((group) => group.items)
  .filter((item) => slugs.includes(item.slug) || item.slug === "installation");

export function Pager({ slug }: { slug: string }) {
  const index = order.findIndex((item) => item.slug === slug);
  const previous = index > 0 ? order[index - 1] : undefined;
  const next = index >= 0 && index < order.length - 1 ? order[index + 1] : undefined;

  if (!previous && !next) return null;

  return (
    <nav aria-label="Pages" className="flex items-center justify-between gap-4 border-t border-brand-line pt-6">
      {previous ? (
        <Link
          href={`/docs/${previous.slug}` as Route}
          className="group flex items-center gap-2 rounded-lg border border-brand-line px-3 py-2 text-sm font-medium transition-colors duration-150 hover:bg-brand-canvas"
        >
          <span aria-hidden className="text-brand-ink-soft transition-transform duration-200 group-hover:-translate-x-0.5">
            ←
          </span>
          {previous.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}` as Route}
          className="group ml-auto flex items-center gap-2 rounded-lg border border-brand-line px-3 py-2 text-sm font-medium transition-colors duration-150 hover:bg-brand-canvas"
        >
          {next.title}
          <span aria-hidden className="text-brand-ink-soft transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
