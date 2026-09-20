"use client";

import * as React from "react";

import { MoonIcon, SunIcon } from "./icons";

/**
 * The frame every component demo sits in.
 *
 * Inside it, philcn's own design tokens take over — the same background,
 * borders and radii a component gets in a real project. That is the point: the
 * site's identity stops at this border, so a demo never flatters a component
 * with colours it would not have in your app.
 */
export function DemoCanvas({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  const [dark, setDark] = React.useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-site-line bg-site-bg-raised shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 border-b border-site-line px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-site-line" />
          <span className="size-2.5 rounded-full bg-site-line" />
          <span className="size-2.5 rounded-full bg-site-line" />
        </div>
        {label !== undefined && (
          <span className="font-mono text-xs text-site-faint">{label}</span>
        )}
        <button
          type="button"
          onClick={() => setDark((value) => !value)}
          className="ml-auto flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 font-mono text-[11px] text-site-faint transition-colors duration-200 hover:bg-site-bg hover:text-site-fg"
          aria-label={dark ? "Show the light theme" : "Show the dark theme"}
        >
          {dark ? <MoonIcon className="size-3.5" /> : <SunIcon className="size-3.5" />}
          {dark ? "dark" : "light"}
        </button>
      </div>

      <div className={dark ? "dark" : undefined}>
        <div className={`bg-background p-6 text-foreground sm:p-10 ${className ?? ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
