"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { groups } from "@/content/registry";

/**
 * The list of everything the library ships, down the left.
 *
 * A component with no page yet is still listed, greyed and unclickable: a
 * reader looking for Tooltip learns that it exists and that its page is
 * coming, instead of concluding it does not.
 */
export function SidebarNav({ written }: { written: string[] }) {
  const path = usePathname();

  return (
    <nav aria-label="Components" className="text-sm">
      {groups.map((group) => (
        <div key={group.title} className="mb-6">
          <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-brand-ink-soft uppercase">
            {group.title}
          </p>
          {/* The links carry their own padding so the hover shape has room; the
              list is pulled back by exactly that much, which puts the text on
              the same line as the heading above it. */}
          <ul className="-ml-2 grid gap-px">
            {group.items.map((item) => {
              const href = `/docs/${item.slug}`;
              const current = path === href;
              if (!written.includes(item.slug)) {
                return (
                  <li key={item.slug}>
                    <span
                      className="block rounded-md px-2 py-1 text-brand-ink-soft/50"
                      title="Not documented yet"
                    >
                      {item.title}
                    </span>
                  </li>
                );
              }
              return (
                <li key={item.slug}>
                  <Link
                    href={href as Route}
                    aria-current={current ? "page" : undefined}
                    className={`block rounded-md px-2 py-1 transition-colors duration-150 ${
                      current
                        ? "bg-brand-soft/60 font-medium text-brand-ink"
                        : "text-brand-ink-soft hover:bg-brand-canvas hover:text-brand-ink"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
