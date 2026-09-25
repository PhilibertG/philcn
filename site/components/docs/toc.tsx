"use client";

import * as React from "react";

/**
 * The sections of the page, down the right, with the one you are reading
 * marked.
 *
 * It follows the page by watching the headings cross the top of the window
 * rather than by measuring scroll offsets: headings move when an example
 * opens its code, and offsets measured once would then point at the wrong
 * place.
 */
export function Toc({ items }: { items: { id: string; title: string }[] }) {
  const [current, setCurrent] = React.useState(items[0]?.id ?? "");

  React.useEffect(() => {
    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting);
        const first = items.find((item) => seen.get(item.id));
        if (first) setCurrent(first.id);
      },
      // A band across the upper third: a heading counts as "here" once it
      // has passed under the navigation bar.
      { rootMargin: "-88px 0px -67% 0px" },
    );

    for (const item of items) {
      const node = document.getElementById(item.id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
        On this page
      </p>
      <ul className="grid gap-px border-l border-brand-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current === item.id ? "location" : undefined}
              className={`-ml-px block border-l py-1 pl-3 transition-colors duration-150 ${
                current === item.id
                  ? "border-brand-primary font-medium text-brand-ink"
                  : "border-transparent text-brand-ink-soft hover:text-brand-ink"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
