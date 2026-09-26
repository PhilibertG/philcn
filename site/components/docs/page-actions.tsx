"use client";

import * as React from "react";

import { Button } from "@philcn/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@philcn/components/ui/dropdown-menu.tsx";

/**
 * Hands the page to something that is not a pair of eyes.
 *
 * "Copy page" puts the whole page on the clipboard as Markdown — the prose,
 * the examples and the prop types — which is what an assistant needs to use
 * a component correctly. The menu beside it opens that same Markdown, or
 * hands its address to an assistant with the question already asked.
 *
 * The address is read from the browser at the moment of the click: at build
 * time the site does not know what domain it will be served from.
 */
export function PageActions({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = React.useState(false);
  const markdownPath = `/docs/${slug}/markdown`;

  async function copy() {
    try {
      const response = await fetch(markdownPath);
      await navigator.clipboard.writeText(await response.text());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // A browser that refuses the clipboard, or an offline page: open the
      // Markdown instead of failing silently.
      window.open(markdownPath, "_blank", "noopener");
    }
  }

  function openWith(base: string) {
    const url = new URL(markdownPath, window.location.origin).toString();
    const question = `Read ${url} and help me use philcn's ${title} component.`;
    window.open(`${base}${encodeURIComponent(question)}`, "_blank", "noopener");
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button variant="outline" size="sm" onClick={copy} className="gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          {copied ? (
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <>
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
            </>
          )}
        </svg>
        {copied ? "Copied" : "Copy page"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Other ways to open this page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={() => window.open(markdownPath, "_blank", "noopener")}>
            View as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openWith("https://claude.ai/new?q=")}>
            Open in Claude
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openWith("https://chatgpt.com/?q=")}>
            Open in ChatGPT
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
